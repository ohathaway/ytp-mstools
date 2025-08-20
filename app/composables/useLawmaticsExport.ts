import type { 
  LawmaticsMatter, 
  LawmaticsRelationship, 
  LawmaticsContact, 
  LawmaticsApiResponse,
  ExportProgress,
  ContactMappings
} from '~/types/lawmatics'
import { exportContactsToWealthCounselCsv } from '~/utils/csvExport'

export const useLawmaticsExport = () => {
  const { $getLmObject, $getLmObjectWithFields } = useNuxtApp()
  const config = useRuntimeConfig()
  const appConfig = useAppConfig()
  
  const isExporting = ref(false)
  const exportError = ref<string | null>(null)
  const exportProgress = ref<ExportProgress>({
    step: 'fetching_matter',
    current: 0,
    total: 0,
    message: 'Preparing export...'
  })

  // Reset export state
  const resetExportState = () => {
    isExporting.value = false
    exportError.value = null
    exportProgress.value = {
      step: 'fetching_matter',
      current: 0,
      total: 0,
      message: 'Preparing export...'
    }
  }

  /**
   * Fetches matter details with relationships
   */
  const fetchMatter = async (matterId: string): Promise<LawmaticsMatter> => {
    exportProgress.value = {
      step: 'fetching_matter',
      current: 1,
      total: 4,
      message: 'Fetching matter details...'
    }

    try {
      const response = await $getLmObjectWithFields(matterId, 'prospects', 'relationships')
      return response
    } catch (error) {
      console.error('Error fetching matter:', error)
      throw new Error(`Failed to fetch matter ${matterId}`)
    }
  }

  /**
   * Fetches relationship details from relationship ID
   */
  const fetchRelationship = async (relationshipId: string): Promise<LawmaticsRelationship> => {
    try {
      const response = await $getLmObjectWithFields(relationshipId, 'relationships', 'all')
      return response
    } catch (error) {
      console.error('Error fetching relationship:', error)
      throw new Error(`Failed to fetch relationship ${relationshipId}`)
    }
  }

  /**
   * Fetches contact details from contact ID
   */
  const fetchContact = async (contactId: string): Promise<LawmaticsContact> => {
    try {
      const response = await $getLmObjectWithFields(contactId, 'contacts', 'all')
      return response
    } catch (error) {
      console.error('Error fetching contact:', error)
      throw new Error(`Failed to fetch contact ${contactId}`)
    }
  }

  /**
   * Fetches all related contacts for a matter
   */
  const fetchMatterContacts = async (matterId: string): Promise<LawmaticsContact[]> => {
    // Step 1: Get matter with relationships
    const matter = await fetchMatter(matterId)
    
    if (!matter.relationships?.relationships?.data?.length) {
      throw new Error('No relationships found for this matter')
    }

    const relationshipIds = matter.relationships.relationships.data.map(rel => rel.id)
    
    exportProgress.value = {
      step: 'fetching_relationships',
      current: 2,
      total: 4,
      message: `Fetching ${relationshipIds.length} relationships...`
    }

    // Step 2: Fetch all relationships to get contact IDs
    const relationships = await Promise.all(
      relationshipIds.map(id => fetchRelationship(id))
    )

    const contactIds = relationships
      .map(rel => rel.attributes.contact_id.toString())
      .filter(Boolean)

    if (!contactIds.length) {
      throw new Error('No contacts found in matter relationships')
    }

    exportProgress.value = {
      step: 'fetching_contacts',
      current: 3,
      total: 4,
      message: `Fetching ${contactIds.length} contacts...`
    }

    // Step 3: Fetch all contacts
    const contacts = await Promise.all(
      contactIds.map(id => fetchContact(id))
    )

    return contacts.filter(Boolean)
  }

  /**
   * Exports matter contacts to Wealth Counsel CSV format
   */
  const exportMatterContactsToWealthCounsel = async (matterId: string): Promise<void> => {
    if (isExporting.value) {
      throw new Error('Export already in progress')
    }

    resetExportState()
    isExporting.value = true

    try {
      // Fetch all contacts for the matter
      const contacts = await fetchMatterContacts(matterId)

      exportProgress.value = {
        step: 'transforming',
        current: 4,
        total: 4,
        message: 'Transforming contact data...'
      }

      // Get the field mappings from app config
      const mappings = appConfig.lawmatics.exportMappings.wealthCounsel as ContactMappings

      exportProgress.value = {
        step: 'generating_csv',
        current: 4,
        total: 4,
        message: 'Generating CSV file...'
      }

      // Transform and export to CSV
      const contactAttributes = contacts.map(contact => contact.attributes)
      exportContactsToWealthCounselCsv(contactAttributes, matterId, mappings)

      exportProgress.value = {
        step: 'complete',
        current: 4,
        total: 4,
        message: `Successfully exported ${contacts.length} contacts`
      }

      // Show success toast
      const { $toast } = useNuxtApp()
      if ($toast) {
        $toast.success(`Exported ${contacts.length} contacts to CSV`)
      }

    } catch (error) {
      console.error('Export failed:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'Export failed'
      exportError.value = errorMessage
      
      exportProgress.value = {
        step: 'complete',
        current: 0,
        total: 4,
        message: `Error: ${errorMessage}`
      }
      
      // Show error toast
      const { $toast } = useNuxtApp()
      if ($toast) {
        $toast.error(errorMessage)
      }
      
      throw error
    } finally {
      isExporting.value = false
    }
  }

  /**
   * Gets export progress for UI feedback
   */
  const getExportProgress = () => {
    return {
      isExporting: readonly(isExporting),
      progress: readonly(exportProgress),
      error: readonly(exportError)
    }
  }

  return {
    fetchMatter,
    fetchRelationship,
    fetchContact,
    fetchMatterContacts,
    exportMatterContactsToWealthCounsel,
    getExportProgress,
    resetExportState
  }
}