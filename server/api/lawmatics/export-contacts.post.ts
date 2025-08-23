import { createId } from '@paralleldrive/cuid2'

interface ExportStatus {
  status: 'processing' | 'fetching_matter' | 'fetching_relationships' | 'fetching_contacts' | 'generating_csv' | 'completed' | 'error'
  matterId: string
  userId: string
  progress?: number
  message?: string
  csvData?: string
  filename?: string
  error?: string
  createdAt: number
  updatedAt: number
}

export default defineEventHandler(async (event) => {
  // Ensure user is authenticated
  if (!event.context.auth) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  const { matterId } = await readBody(event)

  if (!matterId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Matter ID is required'
    })
  }

  // Generate unique export ID
  const exportId = createId()
  const userId = event.context.auth.userId

  // Initialize status in KV storage
  const initialStatus: ExportStatus = {
    status: 'processing',
    matterId,
    userId,
    progress: 0,
    message: 'Initializing export...',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }

  await hubKV().setItem(`export:${exportId}`, initialStatus)

  // Start async processing (fire and forget)
  processExportAsync(exportId, matterId, userId)

  return { exportId }
})

async function processExportAsync(exportId: string, matterId: string, userId: string) {
  const config = useRuntimeConfig()
  const LM_KEY = config.lawmaticsToken
  const LM_HOST = config.lawmaticsUrl

  try {
    // Update status: fetching matter
    await updateExportStatus(exportId, {
      status: 'fetching_matter',
      progress: 10,
      message: 'Fetching matter details...'
    })

    // Step 1: Get matter with relationships
    const matterResponse = await $fetch(`${LM_HOST}/prospects/${matterId}?fields=all`, {
      headers: { Authorization: `Bearer ${LM_KEY}` }
    })

    if (!matterResponse?.data?.relationships?.relationships?.data?.length) {
      throw new Error('No relationships found for this matter')
    }

    const relationshipIds = matterResponse.data.relationships.relationships.data.map((rel: any) => rel.id)

    // Update status: fetching relationships
    await updateExportStatus(exportId, {
      status: 'fetching_relationships',
      progress: 30,
      message: `Fetching ${relationshipIds.length} relationships...`
    })

    // Step 2: Fetch all relationships to get contact IDs
    const relationships = await Promise.all(
      relationshipIds.map(async (id: string) => {
        const response = await $fetch(`${LM_HOST}/relationships/${id}?fields=all`, {
          headers: { Authorization: `Bearer ${LM_KEY}` }
        })
        return response.data
      })
    )

    const contactIds = relationships
      .map((rel: any) => rel.attributes.contact_id.toString())
      .filter(Boolean)

    if (!contactIds.length) {
      throw new Error('No contacts found in matter relationships')
    }

    // Update status: fetching contacts
    await updateExportStatus(exportId, {
      status: 'fetching_contacts',
      progress: 60,
      message: `Fetching ${contactIds.length} contacts...`
    })

    // Step 3: Fetch all contacts
    const contacts = await Promise.all(
      contactIds.map(async (id: string) => {
        const response = await $fetch(`${LM_HOST}/contacts/${id}?fields=all`, {
          headers: { Authorization: `Bearer ${LM_KEY}` }
        })
        return response.data.attributes
      })
    )

    // Update status: generating CSV
    await updateExportStatus(exportId, {
      status: 'generating_csv',
      progress: 90,
      message: 'Generating CSV file...'
    })

    // Step 4: Transform and generate CSV
    const csvData = generateWealthCounselCsv(contacts)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const filename = `matter-${matterId}-contacts-${timestamp}.csv`

    // Update status: completed
    await updateExportStatus(exportId, {
      status: 'completed',
      progress: 100,
      message: `Successfully processed ${contacts.length} contacts`,
      csvData,
      filename
    })

  } catch (error) {
    console.error(`Export ${exportId} failed:`, error)
    
    await updateExportStatus(exportId, {
      status: 'error',
      progress: 0,
      message: error instanceof Error ? error.message : 'Export failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function updateExportStatus(exportId: string, updates: Partial<ExportStatus>) {
  const currentStatusData = await hubKV().getItem(`export:${exportId}`)
  if (!currentStatusData) return

  // Handle both string and object responses from KV
  let currentStatus: ExportStatus
  if (typeof currentStatusData === 'string') {
    currentStatus = JSON.parse(currentStatusData)
  } else {
    currentStatus = currentStatusData as ExportStatus
  }

  const updatedStatus = {
    ...currentStatus,
    ...updates,
    updatedAt: Date.now()
  }

  await hubKV().setItem(`export:${exportId}`, updatedStatus)
}

function generateWealthCounselCsv(contacts: any[]): string {
  // Phone number formatter function
  const formatPhoneNumber = (phone: string | null): string => {
    if (!phone) return ''
    
    // Remove all non-digit characters and unprintable characters
    const digits = phone.replace(/[^\d]/g, '')
    
    // Check if we have a valid US phone number (10 digits)
    if (digits.length === 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    }
    
    // Check if we have 11 digits starting with 1 (US country code)
    if (digits.length === 11 && digits.startsWith('1')) {
      const usDigits = digits.slice(1)
      return `${usDigits.slice(0, 3)}-${usDigits.slice(3, 6)}-${usDigits.slice(6, 10)}`
    }
    
    // For other formats, return the cleaned digits or original if no digits found
    return digits || ''
  }

  // Import the field mappings
  const appConfig = {
    lawmatics: {
      exportMappings: {
        wealthCounsel: {
          Name: (contact: any) => `${contact.first_name || ''} ${contact.last_name || ''}`.trim(),
          Type: (contact: any) => contact.contact_type || 'Individual',
          Client: (contact: any) => contact.contact_type === 'Client' ? 'Yes' : 'No',
          SubType: () => '',
          Website: () => '',
          Im: () => '',
          Notes: (contact: any) => contact.bio || '',
          HomeEmail: (contact: any) => contact.email || contact.email_address || '',
          WorkEmail: () => '',
          HomePhone: (contact: any) => formatPhoneNumber(contact.phone || contact.phone_number || ''),
          WorkPhone: () => '',
          MobilePhone: (contact: any) => formatPhoneNumber(contact.phone || contact.phone_number || ''),
          HomeStreet: (contact: any) => {
            if (!contact.address) return ''
            const addr = contact.address.toString()
            const parts = addr.split(',')
            return parts[0]?.trim() || ''
          },
          HomeCity: (contact: any) => {
            if (!contact.address) return ''
            const addr = contact.address.toString()
            const parts = addr.split(',')
            return parts[1]?.trim() || ''
          },
          HomeState: (contact: any) => {
            if (!contact.address) return ''
            const addr = contact.address.toString()
            const statePart = addr.match(/,\s*([A-Z]{2})\s*\d/)
            return statePart?.[1] || ''
          },
          HomeZip: (contact: any) => {
            if (!contact.address) return ''
            const addr = contact.address.toString()
            const zipMatch = addr.match(/\b(\d{5}(-\d{4})?)\b/)
            return zipMatch?.[1] || ''
          },
          HomeCounty: () => '',
          HomeCountyRef: () => '',
          HomeCountry: () => 'United States',
          WorkStreet: () => '',
          WorkCity: () => '',
          WorkState: () => '',
          WorkZip: () => '',
          WorkCounty: () => '',
          WorkCountyRef: () => '',
          WorkCountry: () => '',
          Taxation: () => '',
          TaxpayerID: (contact: any) => contact.social_security || '',
          FormationState: () => '',
          Subtrust: () => '',
          SeparateCounsel: () => '',
          TrustClassification: () => '',
          RevocableClassification: () => '',
          DateOfTrust: () => '',
          FirstName: (contact: any) => contact.first_name || '',
          MiddleName: (contact: any) => contact.middle_name || '',
          LastName: (contact: any) => contact.last_name || '',
          PreferredName: (contact: any) => contact.informal_name || '',
          Title: (contact: any) => contact.title || '',
          Prefix: (contact: any) => contact.name_prefix || '',
          Suffix: (contact: any) => contact.name_suffix || '',
          OtherType: () => '',
          Status: (contact: any) => contact.contact_type || '',
          Aka: () => '',
          Blind: () => '',
          Disabled: () => '',
          UsCitizen: (contact: any) => contact.citizenship === 'United States' ? 'Yes' : '',
          Gender: (contact: any) => contact.gender || '',
          DoB: (contact: any) => contact.birthdate || '',
          MaritalStatus: (contact: any) => contact.marital_status || '',
          Spouse: (contact: any) => {
            const spouseField = contact.custom_field_values?.['378114']
            return spouseField?.formatted_value || ''
          },
          Anniversary: (contact: any) => {
            const anniversaryField = contact.custom_field_values?.['392650']
            return anniversaryField?.formatted_value || ''
          },
          DeceasedDateOfDeath: (contact: any) => {
            const deathDateField = contact.custom_field_values?.['381116']
            return deathDateField?.formatted_value || ''
          },
          EIN: () => '',
          EmploymentStatus: () => '',
          EstimatedWorth: (contact: any) => {
            const cents = contact.total_estimated_value_cents || 0
            return cents > 0 ? (cents / 100).toString() : ''
          },
          PlaceOfDeathStreet: () => '',
          PlaceOfDeathCity: () => '',
          PlaceOfDeathCounty: () => '',
          PlaceOfDeathCountyRef: () => '',
          PlaceOfDeathCountry: () => '',
          PlaceOfDeathState: () => ''
        }
      }
    }
  }

  const mappings = appConfig.lawmatics.exportMappings.wealthCounsel
  const headers = Object.keys(mappings)

  // Transform contacts
  const transformedContacts = contacts.map(contact => {
    const transformedContact: Record<string, any> = {}
    headers.forEach(header => {
      const mappingFunction = mappings[header as keyof typeof mappings]
      try {
        transformedContact[header] = mappingFunction(contact)
      } catch (error) {
        console.warn(`Error mapping field ${header}:`, error)
        transformedContact[header] = ''
      }
    })
    return transformedContact
  })

  // Generate CSV
  const csvLines = [
    headers.join(','), // Header row
    ...transformedContacts.map(contact => 
      headers.map(header => {
        const value = contact[header] || ''
        // Escape commas and quotes in CSV
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ]

  return csvLines.join('\n')
}