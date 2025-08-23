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
      <!-- Export Button - Office shows menu, Browser shows direct action -->
      <v-menu v-if="$officeState.isOfficeEnvironment">
        <template #activator="{ props }">
          <v-btn
            class="text-none"
            rounded="sm"
            density="comfortable"
            :variant="exportButtonVariant"
            :color="exportButtonColor"
            v-bind="props"
            :loading="isExporting"
            :disabled="isExporting"
            append-icon="mdi-chevron-down"
          >
            <template v-if="isExporting">
              Starting Export...
            </template>
            <template v-else-if="exportError">
              Retry Download
            </template>
            <template v-else>
              Download Related Contacts
              <IconsIconWrapper :icon="IconDownload" width="12" />
            </template>
          </v-btn>
        </template>
        
        <v-list density="compact" min-width="280">
          <v-list-item @click="startExport" prepend-icon="mdi-microsoft-office">
            <v-list-item-title>Office Dialog</v-list-item-title>
            <v-list-item-subtitle>Export within Office environment</v-list-item-subtitle>
          </v-list-item>
          
          <v-list-item @click="openInBrowser" prepend-icon="mdi-open-in-new">
            <v-list-item-title>Open in Browser</v-list-item-title>
            <v-list-item-subtitle>Open in external browser for download</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-menu>
      
      <!-- Direct export button for browser environment -->
      <v-btn
        v-else
        class="text-none"
        rounded="sm"
        density="comfortable"
        :variant="exportButtonVariant"
        :color="exportButtonColor"
        :loading="isExporting"
        :disabled="isExporting"
        @click="startExport"
      >
        <template v-if="isExporting">
          Starting Export...
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

<script setup lang="ts">
import { startCase } from 'lodash-es'
import IconOpen from '@/components/icons/IconOpen.vue'
import IconDownload from '@/components/icons/IconDownload.vue'

const { matter } = defineProps({
  matter: {
    type: Object,
    required: true
  }
})

const { public: { appBrowserUrl } } = useRuntimeConfig()

// Export functionality  
const { $toast } = useNuxtApp()
const isExporting = ref(false)
const exportError = ref(null)

const exportButtonVariant = computed(() => {
  if (exportError.value) return 'outlined'
  return 'tonal'
})

const exportButtonColor = computed(() => {
  if (exportError.value) return 'error'
  return undefined
})

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

const openInBrowser = () => {
  try {
    // Determine the external hostname
    const currentHost = window.location.hostname
    let externalHost = 'tools.ohlawcolorado.com' // Production alias
    
    // For development, use the alternate development host
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      externalHost = '127.0.0.1:3000'
    }
    
    // Build the external URL for browser-based export with autostart
    const protocol = window.location.protocol
    const externalUrl = `${protocol}//${externalHost}/export/lawmatics/${matter.id}?autostart=true`
    
    // Open in external browser (will open default browser in Office environment)
    window.open(externalUrl, '_blank')
    
    $toast?.success('Opening export in your default browser...')
    
  } catch (error) {
    console.error('Error opening in browser:', error)
    $toast?.error('Failed to open in browser')
  }
}

const startExport = async () => {
  if (isExporting.value) return

  isExporting.value = true
  exportError.value = null

  try {
    // Get authenticated fetch from auth store
    const { authenticatedFetch } = useAuthStore()
    
    // Start server-side export
    const response = await authenticatedFetch('/api/lawmatics/export-contacts', {
      method: 'POST',
      body: { matterId: matter.id }
    })

    const { exportId } = response

    // Open dialog for both Office and web environments
    openExportDialog(exportId)

    $toast?.success('Export started! A dialog will open to track progress.')

  } catch (error) {
    console.error('Failed to start export:', error)
    exportError.value = error instanceof Error ? error.message : 'Failed to start export'
    $toast?.error(exportError.value)
  } finally {
    isExporting.value = false
  }
}

const openExportDialog = (exportId) => {
  try {
    // Get auth token for the dialog
    const storedAuth = localStorage.getItem('ohlaw_auth_token')
    let authToken = ''
    
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth)
        const tokenAgeHours = (Date.now() - authData.timestamp) / (1000 * 60 * 60)
        
        if (tokenAgeHours < 1 && authData.idToken) {
          authToken = authData.idToken
        }
      } catch (error) {
        console.error('Error parsing stored auth:', error)
      }
    }

    // Build dialog URL with parameters
    const dialogUrl = `/export-dialog.html?exportId=${exportId}&auth=${encodeURIComponent(authToken)}`

    if ($officeState.isOfficeEnvironment && typeof Office !== 'undefined' && Office.context && Office.context.ui) {
      // Use Office dialog API
      Office.context.ui.displayDialogAsync(
        `${window.location.origin}${dialogUrl}`,
        {
          height: 60,
          width: 50,
          requireHTTPS: false
        },
        (result) => {
          if (result.status === Office.AsyncResultStatus.Failed) {
            console.error('Dialog failed to open:', result.error)
            exportError.value = 'Failed to open export dialog'
            $toast?.error('Failed to open export dialog')
          } else {
            // Handle dialog messages
            result.value.addEventHandler(Office.EventType.DialogMessageReceived, (args) => {
              try {
                const message = JSON.parse(args.message)
                if (message.type === 'export-dialog') {
                  if (message.action === 'download-complete') {
                    $toast?.success('Contact export completed successfully!')
                  } else if (message.action === 'dialog-close') {
                    result.value.close()
                  }
                }
              } catch (error) {
                console.error('Error handling dialog message:', error)
              }
            })

            // Handle dialog closed event
            result.value.addEventHandler(Office.EventType.DialogEventReceived, (args) => {
              if (args.error === 12006) { // Dialog closed by user
                console.log('Export dialog was closed by user')
              }
            })
          }
        }
      )
    } else {
      // Fallback for web environments - open in popup window
      window.open(dialogUrl, '_blank', 'width=600,height=500,scrollbars=yes,resizable=yes')
    }
  } catch (error) {
    console.error('Error opening dialog:', error)
    exportError.value = 'Failed to open export dialog'
    $toast?.error('Failed to open export dialog')
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