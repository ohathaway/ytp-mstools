import { nanoid } from 'nanoid'

interface ExportStatus {
  status: 'processing' | 'fetching_matter' | 'fetching_relationships' | 'fetching_contacts' | 'generating_csv' | 'completed' | 'error'
  matterId: string
  exportId: string
  csvData?: string
  filename?: string
  error?: string
  progress?: {
    current: number
    total: number
    message: string
  }
  createdAt: number
}

export default defineEventHandler(async (event) => {
  try {
    // Validate request
    const body = await readBody(event)
    const { matterId } = body
    
    if (!matterId || typeof matterId !== 'string') {
      throw new Error('matterId is required and must be a string')
    }

    // Generate unique export ID
    const exportId = nanoid()

    // Initialize status in KV store
    const initialStatus: ExportStatus = {
      status: 'processing',
      matterId,
      exportId,
      createdAt: Date.now()
    }

    await hubKV().set(`export:${exportId}`, initialStatus, { ttl: 3600 }) // 1 hour TTL

    // Start async processing (don't await)
    processExportAsync(exportId, matterId)

    return { exportId }
  } catch (error) {
    console.error('Export initiation failed:', error)
    throw createError({
      statusCode: 400,
      statusMessage: error instanceof Error ? error.message : 'Export initiation failed'
    })
  }
})

async function processExportAsync(exportId: string, matterId: string) {
  const config = useRuntimeConfig()
  const LM_KEY = config.lawmaticsToken
  const LM_HOST = config.lawmaticsUrl

  try {
    // Update status: fetching matter
    await updateExportStatus(exportId, {
      status: 'fetching_matter',
      progress: { current: 1, total: 4, message: 'Fetching matter details...' }
    })

    // Fetch matter with relationships (construct URL like the proxy does)
    const matterUrl = new URL(LM_HOST)
    matterUrl.pathname = `/v1/prospects/${matterId}`
    matterUrl.search = '?fields=relationships'
    
    const matterResponse = await $fetch(matterUrl.toString(), {
      headers: { Authorization: `Bearer ${LM_KEY}` }
    })

    if (!matterResponse.data?.relationships?.relationships?.data?.length) {
      throw new Error('No relationships found for this matter')
    }

    const relationshipIds = matterResponse.data.relationships.relationships.data.map((rel: any) => rel.id)

    // Update status: fetching relationships
    await updateExportStatus(exportId, {
      status: 'fetching_relationships',
      progress: { current: 2, total: 4, message: `Fetching ${relationshipIds.length} relationships...` }
    })

    // Fetch all relationships
    const relationships = await Promise.all(
      relationshipIds.map(async (id: string) => {
        const url = new URL(LM_HOST)
        url.pathname = `/v1/relationships/${id}`
        url.search = '?fields=all'
        
        const response = await $fetch(url.toString(), {
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
      progress: { current: 3, total: 4, message: `Fetching ${contactIds.length} contacts...` }
    })

    // Fetch all contacts
    const contacts = await Promise.all(
      contactIds.map(async (id: string) => {
        const url = new URL(LM_HOST)
        url.pathname = `/v1/contacts/${id}`
        url.search = '?fields=all'
        
        const response = await $fetch(url.toString(), {
          headers: { Authorization: `Bearer ${LM_KEY}` }
        })
        return response.data
      })
    )

    // Update status: generating CSV
    await updateExportStatus(exportId, {
      status: 'generating_csv',
      progress: { current: 4, total: 4, message: 'Generating CSV file...' }
    })

    // Transform and generate CSV
    const csvData = await generateWealthCounselCsv(contacts.map(c => c.attributes))
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const filename = `matter-${matterId}-contacts-${timestamp}.csv`

    // Update status: completed
    await updateExportStatus(exportId, {
      status: 'completed',
      csvData,
      filename,
      progress: { current: 4, total: 4, message: `Successfully exported ${contacts.length} contacts` }
    })

  } catch (error) {
    console.error('Export processing failed:', error)
    await updateExportStatus(exportId, {
      status: 'error',
      error: error instanceof Error ? error.message : 'Export processing failed'
    })
  }
}

async function updateExportStatus(exportId: string, updates: Partial<ExportStatus>) {
  const currentStatus = await hubKV().get<ExportStatus>(`export:${exportId}`)
  if (currentStatus) {
    const updatedStatus = { ...currentStatus, ...updates }
    await hubKV().set(`export:${exportId}`, updatedStatus, { ttl: 3600 })
  }
}

async function generateWealthCounselCsv(contacts: any[]): Promise<string> {
  // Define the mappings directly in server context
  const mappings = getWealthCounselMappings()

  // Transform contacts
  const transformedContacts = contacts.map(contact => {
    const transformedContact: Record<string, any> = {}
    
    Object.keys(mappings).forEach(wealthCounselField => {
      const mappingFunction = mappings[wealthCounselField]
      try {
        transformedContact[wealthCounselField] = mappingFunction(contact)
      } catch (error) {
        console.warn(`Error mapping field ${wealthCounselField}:`, error)
        transformedContact[wealthCounselField] = ''
      }
    })
    
    return transformedContact
  })

  // Generate CSV
  const headers = Object.keys(mappings)
  const csvLines = [headers.join(',')]
  
  transformedContacts.forEach(contact => {
    const values = headers.map(header => {
      const value = contact[header]
      if (value === null || value === undefined) return ''
      
      const stringValue = String(value)
      // Escape CSV values
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    })
    csvLines.push(values.join(','))
  })

  return csvLines.join('\n')
}

// Server-side utility functions
function formatPhoneNumber(phone: string | null): string {
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

function parseAddress(address: string | null): { street?: string; city?: string; state?: string; zip?: string; country?: string } {
  if (!address) return {}
  
  // Handle common address formats from the sample data
  const parts = address.split(', ')
  if (parts.length >= 3) {
    const street = parts[0]
    const city = parts[1]
    const stateZip = parts[2]
    const country = parts[3] || ''
    
    // Extract state and zip from "CO 80610" format
    const stateZipMatch = stateZip.match(/^([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/)
    if (stateZipMatch) {
      return {
        street,
        city,
        state: stateZipMatch[1],
        zip: stateZipMatch[2],
        country
      }
    }
  }
  
  // Fallback - return the full address as street
  return { street: address }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    
    // Format as MM/DD/YYYY for Wealth Counsel
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch {
    return ''
  }
}

function getCustomFieldValue(contact: any, fieldName: string): string {
  if (!contact.custom_fields || !Array.isArray(contact.custom_fields)) return ''
  
  const field = contact.custom_fields.find((cf: any) => cf.name === fieldName)
  return field?.formatted_value || field?.value || ''
}

function getWealthCounselMappings() {
  return {
    // Direct field mappings from Lawmatics to Wealth Counsel format
    Name: (contact: any) => `${contact.first_name || ''} ${contact.last_name || ''}`.trim(),
    Type: () => 'Individual',
    Client: () => '',
    SubType: () => '',
    Website: () => '',
    Im: () => '',
    Notes: () => '',
    HomeEmail: (contact: any) => contact.email || contact.email_address || '',
    WorkEmail: () => '',
    HomePhone: (contact: any) => formatPhoneNumber(contact.phone || contact.phone_number),
    WorkPhone: () => '',
    MobilePhone: () => '',
    HomeStreet: (contact: any) => {
      const parsed = parseAddress(contact.address)
      return parsed.street || ''
    },
    HomeCity: (contact: any) => {
      const parsed = parseAddress(contact.address)
      return parsed.city || ''
    },
    HomeState: (contact: any) => {
      const parsed = parseAddress(contact.address)
      return parsed.state || ''
    },
    HomeZip: (contact: any) => {
      const parsed = parseAddress(contact.address)
      return parsed.zip || ''
    },
    HomeCounty: () => '',
    HomeCountyRef: () => '',
    HomeCountry: (contact: any) => {
      const parsed = parseAddress(contact.address)
      return parsed.country || ''
    },
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
    UsCitizen: (contact: any) => contact.citizenship === 'United States' ? 'True' : '',
    Gender: (contact: any) => contact.gender || '',
    DoB: (contact: any) => formatDate(contact.birthdate),
    MaritalStatus: (contact: any) => contact.marital_status || '',
    Spouse: () => '',
    Anniversary: () => '',
    DeceasedDateOfDeath: (contact: any) => getCustomFieldValue(contact, 'Date of Death'),
    EIN: () => '',
    EmploymentStatus: () => '',
    EstimatedWorth: () => '',
    PlaceOfDeathStreet: () => '',
    PlaceOfDeathCity: () => '',
    PlaceOfDeathCounty: () => '',
    PlaceOfDeathCountyRef: () => '',
    PlaceOfDeathCountry: () => '',
    PlaceOfDeathState: () => ''
  }
}