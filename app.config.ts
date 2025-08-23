export default defineAppConfig({
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
        HomePhone: (contact: any) => contact.phone || contact.phone_number || '',
        WorkPhone: () => '',
        MobilePhone: (contact: any) => contact.phone || contact.phone_number || '',
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
        HomeCountry: (contact: any) => {
          if (!contact.address) return 'United States'
          const addr = contact.address.toString()
          return addr.includes('United States') ? 'United States' : 'United States'
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
        UsCitizen: (contact: any) => contact.citizenship === 'United States' ? 'Yes' : '',
        Gender: (contact: any) => contact.gender || '',
        DoB: (contact: any) => contact.birthdate || '',
        MaritalStatus: (contact: any) => contact.marital_status || '',
        Spouse: (contact: any) => {
          const spouseField = contact.custom_field_values?.['378114'] // Spouse field ID
          return spouseField?.formatted_value || ''
        },
        Anniversary: (contact: any) => {
          const anniversaryField = contact.custom_field_values?.['392650'] // Date of Marriage field ID  
          return anniversaryField?.formatted_value || ''
        },
        DeceasedDateOfDeath: (contact: any) => {
          const deathDateField = contact.custom_field_values?.['381116'] // Date of Death field ID
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
})