export default defineNuxtPlugin((nuxtApp) => {
  const { public: { lmFunction, lmBasicAuth } } = useRuntimeConfig()

  const setSearchUrl = (endpoint, searchType, searchTerm) => {
    const baseUrl = `${lmFunction}/${endpoint}`
    
    const searchTypes = {
      last_name: 'last_name',
      first_name: 'first_name',
      email: 'email',
      phone: 'phone'
    }
    const params = new URLSearchParams({
      filter_field: searchTypes[searchType] || 'last_name',
      filter_value: `%${searchTerm.trim()}%`,
      filter_operator: 'ilike',
      fields: 'all'
    })
    return `${baseUrl}?${params.toString()}`
  }

  const searchLm = async searchUrl => {
    try {
      const functionResponse = await $fetch(searchUrl, {
        headers: { authorization: `Basic ${lmBasicAuth}` },
        lazy: true
      }) 
      return functionResponse
    } catch (error) {
      console.error('Error fetching data from Lawmatics: ', error)
      throw error
    }
  }

  const getLmObject = async (id, objectType = 'contact' ) => {
    console.info('fetching lm object')

    const validationErrors = {
      id: !id && 'ID parameter is required',
      objectType: !lmModules.includes(objectType) && `Invalid objectType: ${objectType}. Must be one of: ${lmModules.join(', ')}`
    };
  
    const error = Object.values(validationErrors).find(Boolean);
    try {
      console.assert(!error, error)
      const response = await $fetch(`${lmFunction}/${objectType}/${id}`, {
        headers: { authorization: `Basic ${lmBasicAuth}` },
        lazy: true
      }) 
      return response
    } catch (error) {
      console.error(error.message)
      throw error
    }
  }

  const fetchCustomFields = async () => {
    try {
      const response = await $fetch(`${lmFunction}/custom_fields?fields=all`, {
        headers: { authorization: `Basic ${lmBasicAuth}` },
        lazy: true
      })
      return response
    } catch (error) {
      console.error('Error fetching custom fields from Lawmatics: ', error)
      throw error
    }
  }

  const lmModules = [
    'activities',
    'addresses',
    'companies',
    'contacts',
    'email_addresses',
    'events',
    'files',
    'folders',
    'invoices',
    'notes',
    'phone_numbers',
    'prospects',
    'tasks'
  ]

  const lmFields = [
    {
      "field_label": "Firm Name",
      "field_macro": "{{firm_name}}",
      "field_type": "General"
    },
    {
      "field_label": "Firm Phone Number",
      "field_macro": "{{firm_phone_number}}",
      "field_type": "General"
    },
    {
      "field_label": "Firm Email",
      "field_macro": "{{firm_email}}",
      "field_type": "General"
    },
    {
      "field_label": "Firm Street",
      "field_macro": "{{firm_street}}",
      "field_type": "General"
    },
    {
      "field_label": "Firm Street 2",
      "field_macro": "{{firm_street2}}",
      "field_type": "General"
    },
    {
      "field_label": "Firm City",
      "field_macro": "{{firm_city}}",
      "field_type": "General"
    },
    {
      "field_label": "Firm State",
      "field_macro": "{{firm_state}}",
      "field_type": "General"
    },
    {
      "field_label": "Firm Zipcode",
      "field_macro": "{{firm_zipcode}}",
      "field_type": "General"
    },
    {
      "field_label": "Firm Timezone",
      "field_macro": "{{firm_timezone}}",
      "field_type": "General"
    },
    {
      "field_label": "Current Date: Month Day, Year",
      "field_macro": "{{current_date_format_a}}",
      "field_type": "General"
    },
    {
      "field_label": "Current Date: MM/DD/YYYY",
      "field_macro": "{{current_date_format_b}}",
      "field_type": "General"
    },
    {
      "field_label": "Contact ID",
      "field_macro": "{{contact_id}}",
      "field_type": "Contact"
    },
    {
      "field_label": "First name",
      "field_macro": "{{first_name}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Last name",
      "field_macro": "{{last_name}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Birthdate",
      "field_macro": "{{birthdate}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Birthdate (Day of Week)",
      "field_macro": "{{birthdate_day_of_week}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Name prefix",
      "field_macro": "{{name_prefix}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Middle name",
      "field_macro": "{{middle_name}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Name suffix",
      "field_macro": "{{name_suffix}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Informal name",
      "field_macro": "{{informal_name}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Employer",
      "field_macro": "{{employer}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Occupation",
      "field_macro": "{{occupation}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Citizenship",
      "field_macro": "{{citizenship}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Social security",
      "field_macro": "{{social_security}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Driver license",
      "field_macro": "{{driver_license}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Gender",
      "field_macro": "{{gender}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Marital status",
      "field_macro": "{{marital_status}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Timezone",
      "field_macro": "{{timezone}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Hobbies",
      "field_macro": "{{hobbies}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Bio",
      "field_macro": "{{bio}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Title",
      "field_macro": "{{title}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Unsubscribed",
      "field_macro": "{{unsubscribed}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Last contacted date",
      "field_macro": "{{last_contacted_date}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Phone (Primary)",
      "field_macro": "{{phone}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Address (Primary) - Full Street",
      "field_macro": "{{full_street}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Address (Primary) - City, State, Zip",
      "field_macro": "{{city_state_zip}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Address (Primary) - Street",
      "field_macro": "{{street}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Address (Primary) - Street2",
      "field_macro": "{{street2}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Address (Primary) - City",
      "field_macro": "{{city}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Address (Primary) - State",
      "field_macro": "{{state}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Address (Primary) - Zipcode",
      "field_macro": "{{zipcode}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Address (Primary) - Country",
      "field_macro": "{{country}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Address (Primary)",
      "field_macro": "{{address}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Age",
      "field_macro": "{{age}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Days Since Last Contact",
      "field_macro": "{{days_since_last_contact}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Contact Type",
      "field_macro": "{{contact_type}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Custom Contact Type",
      "field_macro": "{{custom_contact_type}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Tags (Contact)",
      "field_macro": "{{contact_tags}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Full Name",
      "field_macro": "{{full_name}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Email (Primary)",
      "field_macro": "{{email}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Notes",
      "field_macro": "{{note}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Created By",
      "field_macro": "{{created_by}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Created At",
      "field_macro": "{{created_at}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Updated At",
      "field_macro": "{{updated_at}}",
      "field_type": "Contact"
    },
    {
      "field_label": "Matter ID",
      "field_macro": "{{id}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Actual Value",
      "field_macro": "{{actual_value}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Estimated Value",
      "field_macro": "{{estimated_value}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Lead Cost",
      "field_macro": "{{lead_cost}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Referring Url",
      "field_macro": "{{referring_url}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Practice Area",
      "field_macro": "{{practice_area}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Stage",
      "field_macro": "{{stage}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Source",
      "field_macro": "{{source}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Status",
      "field_macro": "{{status}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Sub Status",
      "field_macro": "{{sub_status}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Campaign",
      "field_macro": "{{campaign}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Owned By",
      "field_macro": "{{owned_by}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Lead Attorney",
      "field_macro": "{{lead_attorney}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Originating Attorney",
      "field_macro": "{{originating_attorney}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Assigned Staff",
      "field_macro": "{{assigned_staff}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Converted At",
      "field_macro": "{{converted_date}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Case Title",
      "field_macro": "{{case_title}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Case Number",
      "field_macro": "{{case_number}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Case Blurb",
      "field_macro": "{{case_blurb}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Statute of Limitations",
      "field_macro": "{{statute_of_limitations}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Tags (Matter)",
      "field_macro": "{{matter_tags}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Type of Billing",
      "field_macro": "{{type_of_billing}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Days to Close",
      "field_macro": "{{days_to_close}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Has Portal Access",
      "field_macro": "{{has_portal}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Time in Case File Opened",
      "field_macro": "{{time_in_stage_85607}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Time in Draft Complete",
      "field_macro": "{{time_in_stage_85611}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Time in Lost",
      "field_macro": "{{time_in_stage_85776}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Time in CIMI Sent",
      "field_macro": "{{time_in_stage_89622}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Time in CIMI In Progress",
      "field_macro": "{{time_in_stage_92022}}",
      "field_type": "Matter"
    },
    {
      "field_label": "Time in Homework Assigned",
      "field_macro": "{{time_in_stage_85606}}",
      "field_type": "Matter"
    },
  ]

  return {
    provide: {
      lmFields,
      getLmObject,
      searchLm,
      setSearchUrl,
      fetchCustomFields
    }
  }
})