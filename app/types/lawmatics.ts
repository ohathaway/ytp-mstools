// TypeScript interfaces for Lawmatics API data structures

export interface LawmaticsCustomField {
  id: string
  name: string
  field_type: string
  value: any
  formatted_value: string
}

export interface LawmaticsContact {
  id: string
  type: 'contact'
  attributes: {
    first_name: string | null
    last_name: string | null
    email: string | null
    email_address: string | null
    phone: string | null
    phone_number: string | null
    address: string | null
    birthdate: string | null
    name_prefix: string | null
    middle_name: string | null
    name_suffix: string | null
    informal_name: string | null
    employer: string | null
    occupation: string | null
    citizenship: string | null
    bio: string | null
    title: string | null
    hobbies: string | null
    social_security: string | null
    age: number | null
    driver_license: string | null
    gender: string | null
    marital_status: string | null
    timezone: string | null
    tracking_source_id: string | null
    date_of_last_contact: string | null
    days_since_last_contact: number
    total_actual_value_cents: number
    total_estimated_value_cents: number
    unsubscribed: boolean
    photo_url: string | null
    custom_fields: LawmaticsCustomField[]
    custom_field_values: Record<string, LawmaticsCustomField>
    contact_type: string
    created_at: string
    updated_at: string
  }
  relationships: {
    prospects: { data: Array<{ id: string; type: 'prospect' }> }
    tags: { data: Array<{ id: string; type: 'tag' }> }
    emails: { data: Array<{ id: string; type: 'email_address' }> }
    phone_numbers: { data: Array<{ id: string; type: 'phone_number' }> }
    addresses: { data: Array<{ id: string; type: 'address' }> }
    notes: { data: Array<{ id: string; type: 'note' }> }
    files: { data: Array<{ id: string; type: 'file' }> }
    folders: { data: Array<{ id: string; type: 'folder' }> }
    created_by: { data: { id: string; type: 'user' } | null }
    client: { data: { id: string; type: 'client' } | null }
    company: { data: { id: string; type: 'company' } | null }
    custom_contact_type: { data: { id: string; type: 'custom_contact_type' } | null }
  }
}

export interface LawmaticsMatter {
  id: string
  type: 'prospect'
  attributes: {
    first_name: string
    last_name: string
    case_title: string
    case_number: string
    case_blurb: string | null
    status: string
    type_of_billing: string | null
    name: string
    email: string
    phone: string
    phone_number: string
    email_address: string
    address: string
    birthdate: string | null
    name_prefix: string | null
    middle_name: string | null
    name_suffix: string | null
    sub_status: string
    informal_name: string | null
    employer: string | null
    occupation: string | null
    citizenship: string | null
    bio: string | null
    title: string | null
    hobbies: string | null
    social_security: string | null
    age: number | null
    referring_url: string | null
    driver_license: string | null
    gender: string | null
    marital_status: string | null
    timezone: string | null
    estimated_value_cents: number
    actual_value_cents: number
    lead_cost_cents: number
    date_of_last_contact: string | null
    days_since_last_contact: number
    converted_date: string | null
    statute_of_limitations: string | null
    street: string
    street2: string
    city: string
    state: string
    zipcode: string
    country: string
    full_street: string
    city_state_zip: string
    unsubscribed: boolean
    full_address: string
    photo_url: string | null
    custom_fields: LawmaticsCustomField[]
    custom_field_values: Record<string, LawmaticsCustomField>
    created_at: string
    updated_at: string
    last_contacted_date: string | null
  }
  relationships: {
    source: { data: { id: string; type: 'source' } | null }
    stage: { data: { id: string; type: 'stage' } | null }
    campaign: { data: { id: string; type: 'campaign' } | null }
    practice_area: { data: { id: string; type: 'practice_area' } | null }
    salesperson: { data: { id: string; type: 'user' } | null }
    lead_attorney: { data: { id: string; type: 'user' } | null }
    originating_attorney: { data: { id: string; type: 'user' } | null }
    owned_by: { data: { id: string; type: 'user' } | null }
    created_by: { data: { id: string; type: 'user' } | null }
    contact: { data: { id: string; type: 'contact' } | null }
    company: { data: { id: string; type: 'company' } | null }
    assigned_staff: { data: Array<{ id: string; type: 'user' }> }
    events: { data: Array<{ id: string; type: 'event' }> }
    file_requests: { data: Array<{ id: string; type: 'file_request' }> }
    documents: { data: Array<{ id: string; type: 'file' }> }
    files: { data: Array<{ id: string; type: 'file' }> }
    folders: { data: Array<{ id: string; type: 'folder' }> }
    notes: { data: Array<{ id: string; type: 'note' }> }
    tasks: { data: Array<{ id: string; type: 'task' }> }
    emails: { data: Array<{ id: string; type: 'email_address' }> }
    phone_numbers: { data: Array<{ id: string; type: 'phone_number' }> }
    addresses: { data: Array<{ id: string; type: 'address' }> }
    invoices: { data: Array<{ id: string; type: 'invoice' }> }
    tags: { data: Array<{ id: string; type: 'tag' }> }
    relationships: { data: Array<{ id: string; type: 'relationship' }> }
  }
}

export interface LawmaticsRelationship {
  id: string
  type: 'relationship'
  attributes: {
    name: string
    prospect_id: number
    contact_id: number
    relationship_type_id: number
    created_at: string
    updated_at: string
  }
}

export interface LawmaticsApiResponse<T> {
  data: T
  meta?: {
    total_pages: number
    limit_per_page: number
    total_entries: number
  }
  links?: {
    self: string
    next?: string
  }
}

export interface WealthCounselContact {
  Name: string
  Type: string
  Client: string
  SubType: string
  Website: string
  Im: string
  Notes: string
  HomeEmail: string
  WorkEmail: string
  HomePhone: string
  WorkPhone: string
  MobilePhone: string
  HomeStreet: string
  HomeCity: string
  HomeState: string
  HomeZip: string
  HomeCounty: string
  HomeCountyRef: string
  HomeCountry: string
  WorkStreet: string
  WorkCity: string
  WorkState: string
  WorkZip: string
  WorkCounty: string
  WorkCountyRef: string
  WorkCountry: string
  Taxation: string
  TaxpayerID: string
  FormationState: string
  Subtrust: string
  SeparateCounsel: string
  TrustClassification: string
  RevocableClassification: string
  DateOfTrust: string
  FirstName: string
  MiddleName: string
  LastName: string
  PreferredName: string
  Title: string
  Prefix: string
  Suffix: string
  OtherType: string
  Status: string
  Aka: string
  Blind: string
  Disabled: string
  UsCitizen: string
  Gender: string
  DoB: string
  MaritalStatus: string
  Spouse: string
  Anniversary: string
  DeceasedDateOfDeath: string
  EIN: string
  EmploymentStatus: string
  EstimatedWorth: string
  PlaceOfDeathStreet: string
  PlaceOfDeathCity: string
  PlaceOfDeathCounty: string
  PlaceOfDeathCountyRef: string
  PlaceOfDeathCountry: string
  PlaceOfDeathState: string
}

export type ContactMappingFunction = (contact: LawmaticsContact['attributes']) => string
export type ContactMappings = Record<keyof WealthCounselContact, ContactMappingFunction>

export interface ExportProgress {
  step: 'fetching_matter' | 'fetching_relationships' | 'fetching_contacts' | 'transforming' | 'generating_csv' | 'complete'
  current: number
  total: number
  message: string
}