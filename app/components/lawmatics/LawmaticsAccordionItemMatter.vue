<template>
  <fluent-accordion-item>
    <span slot="heading">
      {{ attributes.last_name }} - {{ attributes.case_title }}
    </span>
    <div class="matter-details">
      <!-- <p><strong>Matter ID:</strong> {{ id }}</p> -->
      <p><strong>Status:</strong> {{ attributes.status }}</p>
      <p><strong>Joint Plan?:</strong> {{ jointPlan }}</p>
      <!-- <p><strong>Created At:</strong> {{ formattedCreatedAt }}</p> -->
      <!-- <p><strong>Updated At:</strong> {{ formattedUpdatedAt }}</p> -->
      <!-- Add more matter details as needed -->
      <v-btn
        v-if="trustName"
        class="text-none"
        rounded="sm"
        density="comfortable"
        variant="tonal"
        @click="insertInfo(trustName.formatted_value)"
        :id="`trust_name-${matter.id}`"
      >
        {{ trustName.formatted_value }}
      </v-btn>
      <LawmaticsDateButton
        v-if="trustOrWillDate"
        :date="trustOrWillDate.formatted_value"
        :objectId="matter.id"
        label="Trust or Will Date"
      />
      <v-btn
        v-if="$officeState.isOfficeEnvironment === false"
        class="text-none"
        rounded="sm"
        density="comfortable"
        :variant="exportError ? 'outlined' : 'tonal'"
        :color="exportError ? 'error' : undefined"
        @click="downloadRelatedContacts"
        :loading="isExporting"
        :disabled="isExporting"
      >
        <template v-if="isExporting">
          Starting export...
        </template>
        <template v-else-if="exportError">
          Retry Download
        </template>
        <template v-else>
          Download Related Contacts
          <IconsIconWrapper :icon="IconDownload" width="12" />
        </template>
      </v-btn>
      <v-btn
        class="text-none"
        rounded="sm"
        density="comfortable"
        variant="tonal"
        @click="openNewWindow(matterLink)"
      >
        Open in Lawmatics
        <IconsIconWrapper :icon="IconOpen" width="12" />
      </v-btn>
    </div>
  </fluent-accordion-item>
</template>

<script setup>
import { startCase } from 'lodash-es'
import IconOpen from '@/components/icons/IconOpen.vue'
import IconDownload from '@/components/icons/IconDownload.vue'

const { matter } = defineProps({
  matter: {
    type: Object,
    required: true
  }
})

// Export functionality using server-side processing
const isExporting = ref(false)
const exportError = ref(null)

const attributes = matter.attributes

const matterLink = computed(() => {
  return `https://app.lawmatics.com/matters/${matter.id}/details`
})

const { $officeState } = useNuxtApp()

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const trustName = computed(() => {
  return attributes.custom_fields.filter(att => {
    return att.name === 'Trust Name'
  })[0] || ''
})

const trustOrWillDate = computed(() => {
  return attributes.custom_fields.filter(att => {
    return att.name === 'Trust or Will Date'
  })[0] || ''
})

const jointPlan = computed(() => {
  const jointPlan = attributes.custom_fields.filter(att => {
    return att.name === 'Joint Plan'
  })[0] 
  return jointPlan?.formatted_value || 'No'
})

const downloadRelatedContacts = async () => {
  if (isExporting.value) return
  
  isExporting.value = true
  exportError.value = null
  
  try {
    // Get authenticated fetch function from auth store
    const authStore = useAuthStore()
    
    // Initiate server-side export with authentication
    const response = await authStore.authenticatedFetch('/api/lawmatics/export-contacts', {
      method: 'POST',
      body: { matterId: matter.id }
    })
    
    const { exportId } = response
    
    // Open Office dialog for download progress with auth token
    const dialogUrl = `/download-dialog.html?exportId=${exportId}&token=${encodeURIComponent(authStore.idToken)}`
    
    if (typeof Office !== 'undefined' && Office.context?.ui) {
      // Office environment - use displayDialogAsync
      Office.context.ui.displayDialogAsync(
        `${window.location.origin}${dialogUrl}`,
        {
          height: 50,
          width: 40,
          displayInIframe: false
        },
        (result) => {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            // Handle dialog messages
            result.value.addEventHandler(Office.EventType.DialogMessageReceived, (args) => {
              const message = JSON.parse(args.message)
              if (message.type === 'lawmatics-export') {
                if (message.message === 'download-complete') {
                  // Show success message
                  const { $toast } = useNuxtApp()
                  if ($toast) {
                    $toast.success('Contacts exported successfully!')
                  }
                }
                // Close dialog
                result.value.close()
              }
            })
          } else {
            console.error('Failed to open dialog:', result.error)
            exportError.value = 'Failed to open download dialog'
          }
        }
      )
    } else {
      // Browser environment - open in new window for testing
      const popup = window.open(dialogUrl, 'lawmatics-export', 'width=500,height=600,scrollbars=yes,resizable=yes')
      
      // Listen for messages from popup
      const messageHandler = (event) => {
        if (event.data?.type === 'lawmatics-export') {
          if (event.data.message === 'download-complete') {
            const { $toast } = useNuxtApp()
            if ($toast) {
              $toast.success('Contacts exported successfully!')
            }
          }
          popup?.close()
          window.removeEventListener('message', messageHandler)
        }
      }
      
      window.addEventListener('message', messageHandler)
    }
    
  } catch (error) {
    console.error('Export initiation failed:', error)
    exportError.value = error instanceof Error ? error.message : 'Export failed'
    
    const { $toast } = useNuxtApp()
    if ($toast) {
      $toast.error(exportError.value)
    }
  } finally {
    isExporting.value = false
  }
}
</script>

<style scoped>
.matter-details {
  padding: 1rem;
}
.matter-details p {
  margin: 0.5rem 0;
}
</style>