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
      "field_macro": "{{firm_name}}"
    },
    {
      "field_label": "Firm Phone Number",
      "field_macro": "{{firm_phone_number}}"
    },
    {
      "field_label": "Firm Email",
      "field_macro": "{{firm_email}}"
    },
    {
      "field_label": "Firm Street",
      "field_macro": "{{firm_street}}"
    },
    {
      "field_label": "Firm Street 2",
      "field_macro": "{{firm_street2}}"
    },
    {
      "field_label": "Firm City",
      "field_macro": "{{firm_city}}"
    },
    {
      "field_label": "Firm State",
      "field_macro": "{{firm_state}}"
    },
    {
      "field_label": "Firm Zipcode",
      "field_macro": "{{firm_zipcode}}"
    },
    {
      "field_label": "Firm Timezone",
      "field_macro": "{{firm_timezone}}"
    },
    {
      "field_label": "Current Date: Month Day, Year",
      "field_macro": "{{current_date_format_a}}"
    },
    {
      "field_label": "Current Date: MM/DD/YYYY",
      "field_macro": "{{current_date_format_b}}"
    },
    {
      "field_label": "Contact ID",
      "field_macro": "{{contact_id}}"
    },
    {
      "field_label": "First name",
      "field_macro": "{{first_name}}"
    },
    {
      "field_label": "Last name",
      "field_macro": "{{last_name}}"
    },
    {
      "field_label": "Birthdate",
      "field_macro": "{{birthdate}}"
    },
    {
      "field_label": "Birthdate (Day of Week)",
      "field_macro": "{{birthdate_day_of_week}}"
    },
    {
      "field_label": "Name prefix",
      "field_macro": "{{name_prefix}}"
    },
    {
      "field_label": "Middle name",
      "field_macro": "{{middle_name}}"
    },
    {
      "field_label": "Name suffix",
      "field_macro": "{{name_suffix}}"
    },
    {
      "field_label": "Informal name",
      "field_macro": "{{informal_name}}"
    },
    {
      "field_label": "Employer",
      "field_macro": "{{employer}}"
    },
    {
      "field_label": "Occupation",
      "field_macro": "{{occupation}}"
    },
    {
      "field_label": "Citizenship",
      "field_macro": "{{citizenship}}"
    },
    {
      "field_label": "Social security",
      "field_macro": "{{social_security}}"
    },
    {
      "field_label": "Driver license",
      "field_macro": "{{driver_license}}"
    },
    {
      "field_label": "Gender",
      "field_macro": "{{gender}}"
    },
    {
      "field_label": "Marital status",
      "field_macro": "{{marital_status}}"
    },
    {
      "field_label": "Timezone",
      "field_macro": "{{timezone}}"
    },
    {
      "field_label": "Hobbies",
      "field_macro": "{{hobbies}}"
    },
    {
      "field_label": "Bio",
      "field_macro": "{{bio}}"
    },
    {
      "field_label": "Title",
      "field_macro": "{{title}}"
    },
    {
      "field_label": "Unsubscribed",
      "field_macro": "{{unsubscribed}}"
    },
    {
      "field_label": "Last contacted date",
      "field_macro": "{{last_contacted_date}}"
    },
    {
      "field_label": "Phone (Primary)",
      "field_macro": "{{phone}}"
    },
    {
      "field_label": "Address (Primary) - Full Street",
      "field_macro": "{{full_street}}"
    },
    {
      "field_label": "Address (Primary) - City, State, Zip",
      "field_macro": "{{city_state_zip}}"
    },
    {
      "field_label": "Address (Primary) - Street",
      "field_macro": "{{street}}"
    },
    {
      "field_label": "Address (Primary) - Street2",
      "field_macro": "{{street2}}"
    },
    {
      "field_label": "Address (Primary) - City",
      "field_macro": "{{city}}"
    },
    {
      "field_label": "Address (Primary) - State",
      "field_macro": "{{state}}"
    },
    {
      "field_label": "Address (Primary) - Zipcode",
      "field_macro": "{{zipcode}}"
    },
    {
      "field_label": "Address (Primary) - Country",
      "field_macro": "{{country}}"
    },
    {
      "field_label": "Address (Primary)",
      "field_macro": "{{address}}"
    },
    {
      "field_label": "Age",
      "field_macro": "{{age}}"
    },
    {
      "field_label": "Days Since Last Contact",
      "field_macro": "{{days_since_last_contact}}"
    },
    {
      "field_label": "Contact Type",
      "field_macro": "{{contact_type}}"
    },
    {
      "field_label": "Custom Contact Type",
      "field_macro": "{{custom_contact_type}}"
    },
    {
      "field_label": "Tags (Contact)",
      "field_macro": "{{contact_tags}}"
    },
    {
      "field_label": "Full Name",
      "field_macro": "{{full_name}}"
    },
    {
      "field_label": "Email (Primary)",
      "field_macro": "{{email}}"
    },
    {
      "field_label": "Notes",
      "field_macro": "{{note}}"
    },
    {
      "field_label": "Created By",
      "field_macro": "{{created_by}}"
    },
    {
      "field_label": "Created At",
      "field_macro": "{{created_at}}"
    },
    {
      "field_label": "Updated At",
      "field_macro": "{{updated_at}}"
    },
    {
      "field_label": "AKA",
      "field_macro": "{{custom_field_381111}}"
    },
    {
      "field_label": "Adopted?",
      "field_macro": "{{custom_field_445890}}"
    },
    {
      "field_label": "Birth Place",
      "field_macro": "{{custom_field_445556}}"
    },
    {
      "field_label": "Child of",
      "field_macro": "{{custom_field_428743}}"
    },
    {
      "field_label": "County",
      "field_macro": "{{custom_field_392646}}"
    },
    {
      "field_label": "Date of Death",
      "field_macro": "{{custom_field_381116}}"
    },
    {
      "field_label": "Date of Death (Day of Week)",
      "field_macro": "{{custom_field_381116_w}}"
    },
    {
      "field_label": "Date of Marriage",
      "field_macro": "{{custom_field_392650}}"
    },
    {
      "field_label": "Date of Marriage (Day of Week)",
      "field_macro": "{{custom_field_392650_w}}"
    },
    {
      "field_label": "Disinherit?",
      "field_macro": "{{custom_field_428744}}"
    },
    {
      "field_label": "Either Grandparent Living?",
      "field_macro": "{{custom_field_463749}}"
    },
    {
      "field_label": "Either Parent Living?",
      "field_macro": "{{custom_field_463748}}"
    },
    {
      "field_label": "Has Children",
      "field_macro": "{{custom_field_392739}}"
    },
    {
      "field_label": "Prefers Paper Forms",
      "field_macro": "{{custom_field_426183}}"
    },
    {
      "field_label": "Recovery Client",
      "field_macro": "{{custom_field_381114}}"
    },
    {
      "field_label": "Tax ID",
      "field_macro": "{{custom_field_381115}}"
    },
    {
      "field_label": "Upright Client",
      "field_macro": "{{custom_field_381117}}"
    },
    {
      "field_label": "Matter ID",
      "field_macro": "{{id}}"
    },
    {
      "field_label": "Actual Value",
      "field_macro": "{{actual_value}}"
    },
    {
      "field_label": "Estimated Value",
      "field_macro": "{{estimated_value}}"
    },
    {
      "field_label": "Lead Cost",
      "field_macro": "{{lead_cost}}"
    },
    {
      "field_label": "Referring Url",
      "field_macro": "{{referring_url}}"
    },
    {
      "field_label": "Practice Area",
      "field_macro": "{{practice_area}}"
    },
    {
      "field_label": "Stage",
      "field_macro": "{{stage}}"
    },
    {
      "field_label": "Source",
      "field_macro": "{{source}}"
    },
    {
      "field_label": "Status",
      "field_macro": "{{status}}"
    },
    {
      "field_label": "Sub Status",
      "field_macro": "{{sub_status}}"
    },
    {
      "field_label": "Campaign",
      "field_macro": "{{campaign}}"
    },
    {
      "field_label": "Owned By",
      "field_macro": "{{owned_by}}"
    },
    {
      "field_label": "Lead Attorney",
      "field_macro": "{{lead_attorney}}"
    },
    {
      "field_label": "Originating Attorney",
      "field_macro": "{{originating_attorney}}"
    },
    {
      "field_label": "Assigned Staff",
      "field_macro": "{{assigned_staff}}"
    },
    {
      "field_label": "Converted At",
      "field_macro": "{{converted_date}}"
    },
    {
      "field_label": "Case Title",
      "field_macro": "{{case_title}}"
    },
    {
      "field_label": "Case Number",
      "field_macro": "{{case_number}}"
    },
    {
      "field_label": "Case Blurb",
      "field_macro": "{{case_blurb}}"
    },
    {
      "field_label": "Statute of Limitations",
      "field_macro": "{{statute_of_limitations}}"
    },
    {
      "field_label": "Tags (Matter)",
      "field_macro": "{{matter_tags}}"
    },
    {
      "field_label": "Type of Billing",
      "field_macro": "{{type_of_billing}}"
    },
    {
      "field_label": "Days to Close",
      "field_macro": "{{days_to_close}}"
    },
    {
      "field_label": "Has Portal Access",
      "field_macro": "{{has_portal}}"
    },
    {
      "field_label": "Time in Case File Opened",
      "field_macro": "{{time_in_stage_85607}}"
    },
    {
      "field_label": "Time in Draft Complete",
      "field_macro": "{{time_in_stage_85611}}"
    },
    {
      "field_label": "Time in Lost",
      "field_macro": "{{time_in_stage_85776}}"
    },
    {
      "field_label": "Time in CIMI Sent",
      "field_macro": "{{time_in_stage_89622}}"
    },
    {
      "field_label": "Time in CIMI In Progress",
      "field_macro": "{{time_in_stage_92022}}"
    },
    {
      "field_label": "Time in Homework Assigned",
      "field_macro": "{{time_in_stage_85606}}"
    },
    {
      "field_label": "Are there any written contracts between you and your business partners, if any?",
      "field_macro": "{{custom_field_381275}}"
    },
    {
      "field_label": "BK13 Individual Amount",
      "field_macro": "{{custom_field_459196}}"
    },
    {
      "field_label": "BK7 Individual Amount",
      "field_macro": "{{custom_field_459195}}"
    },
    {
      "field_label": "Birth Date",
      "field_macro": "{{custom_field_384915}}"
    },
    {
      "field_label": "Birth Date (Day of Week)",
      "field_macro": "{{custom_field_384915_w}}"
    },
    {
      "field_label": "Business Legal Name",
      "field_macro": "{{custom_field_381963}}"
    },
    {
      "field_label": "Child",
      "field_macro": "{{custom_field_378192}}"
    },
    {
      "field_label": "Child (2)",
      "field_macro": "{{custom_field_392624}}"
    },
    {
      "field_label": "Child (3)",
      "field_macro": "{{custom_field_416648}}"
    },
    {
      "field_label": "Child (4)",
      "field_macro": "{{custom_field_433926}}"
    },
    {
      "field_label": "Co-debtor",
      "field_macro": "{{custom_field_378787}}"
    },
    {
      "field_label": "Contribution Percentage",
      "field_macro": "{{custom_field_381269}}"
    },
    {
      "field_label": "Contribution Percentage 1",
      "field_macro": "{{custom_field_381270}}"
    },
    {
      "field_label": "Contribution Percentage 2",
      "field_macro": "{{custom_field_381271}}"
    },
    {
      "field_label": "Cpa or Tax Advisor",
      "field_macro": "{{custom_field_381257}}"
    },
    {
      "field_label": "Trust Name",
      "field_macro": "{{custom_field_494870}}"
    }
  ]

  return {
    provide: {
      lmFields,
      getLmObject,
      searchLm,
      setSearchUrl
    }
  }
})