import { formatPhoneNumber } from '~/utils/ohlawTS'

export default defineAppConfig({
  lawmatics: {
    exportMappings: {
      wealthCounsel: {
        // Direct field mappings from Lawmatics to Wealth Counsel format
        Name: (contact: any) => `${contact.first_name || ''} ${contact.last_name || ''}`.trim(),
        Type: () => 'Individual', // Default to Individual for contacts
        Client: () => '', // Empty by default
        SubType: () => '',
        Website: () => '',
        Im: () => '',
        Notes: () => '',
        HomeEmail: (contact: any) => contact.email || contact.email_address || '',
        WorkEmail: () => '',
        HomePhone: (contact: any) => formatPhoneNumber(contact.phone || contact.phone_number),
        WorkPhone: () => '',
        MobilePhone: () => '',
        // Address parsing - Lawmatics stores as single string, need to parse
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
        Spouse: () => '', // This would need to be derived from relationships
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
  }
})

// Helper functions used in mappings
function parseAddress(address: string | null): { street?: string; city?: string; state?: string; zip?: string; country?: string } {
  if (!address) return {}
  
  // Handle common address formats from the sample data
  // "15785 County Rd. 84, Ault, CO 80610"
  // "8218 5th St, Wellington, CO 80549"
  // "2444 Ivy Way, Erie, CO 80516, United States"
  
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