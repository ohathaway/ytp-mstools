<template>
  <div class="download-dialog">
    <div class="header">
      <h2>Downloading Related Contacts</h2>
    </div>
    
    <div class="content">
      <div v-if="status === 'error'" class="error-state">
        <div class="error-icon">❌</div>
        <h3>Export Failed</h3>
        <p>{{ errorMessage }}</p>
        <fluent-button @click="closeDialog">Close</fluent-button>
      </div>
      
      <div v-else-if="status === 'completed'" class="success-state">
        <div class="success-icon">✅</div>
        <h3>Export Complete</h3>
        <p>{{ progressMessage }}</p>
        <p v-if="filename">File: {{ filename }}</p>
        <fluent-button appearance="accent" @click="downloadFile">Download CSV</fluent-button>
        <fluent-button @click="closeDialog">Close</fluent-button>
      </div>
      
      <div v-else class="loading-state">
        <div class="spinner">⏳</div>
        <h3>Preparing Export...</h3>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <p>{{ progressMessage }}</p>
        <p class="progress-text">{{ progressCurrent }} of {{ progressTotal }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const exportId = route.params.id

// Skip authentication checks for this dialog page
definePageMeta({
  auth: false,
  layout: false
})

// Reactive state
const status = ref('processing')
const errorMessage = ref('')
const progressMessage = ref('Initializing export...')
const progressCurrent = ref(0)
const progressTotal = ref(4)
const filename = ref('')

// Computed
const progressPercentage = computed(() => {
  if (progressTotal.value === 0) return 0
  return Math.round((progressCurrent.value / progressTotal.value) * 100)
})

// Polling interval
const pollInterval = ref(null)

// Start polling when component mounts
onMounted(() => {
  startPolling()
})

// Clean up interval on unmount
onUnmounted(() => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
  }
})

const startPolling = () => {
  pollStatus()
  pollInterval.value = setInterval(pollStatus, 1000) // Poll every second
}

const pollStatus = async () => {
  try {
    // Get auth token from URL parameter
    const token = route.query.token
    if (!token) {
      throw new Error('Authentication token is required')
    }
    
    const response = await $fetch(`/api/lawmatics/export-status/${exportId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    status.value = response.status
    
    if (response.progress) {
      progressCurrent.value = response.progress.current
      progressTotal.value = response.progress.total
      progressMessage.value = response.progress.message
    }
    
    if (response.error) {
      errorMessage.value = response.error
    }
    
    if (response.filename) {
      filename.value = response.filename
    }
    
    // Stop polling if completed or error
    if (status.value === 'completed' || status.value === 'error') {
      if (pollInterval.value) {
        clearInterval(pollInterval.value)
        pollInterval.value = null
      }
      
      // Auto-download if completed
      if (status.value === 'completed') {
        setTimeout(downloadFile, 1000) // Small delay for better UX
      }
    }
    
  } catch (error) {
    console.error('Status polling failed:', error)
    status.value = 'error'
    errorMessage.value = 'Failed to check export status'
    
    if (pollInterval.value) {
      clearInterval(pollInterval.value)
      pollInterval.value = null
    }
  }
}

const downloadFile = async () => {
  try {
    // Trigger download
    const downloadUrl = `/api/download/lawmatics-csv/${exportId}`
    window.location.href = downloadUrl
    
    // Notify parent and close dialog after short delay
    setTimeout(() => {
      notifyParentAndClose('download-complete')
    }, 2000)
    
  } catch (error) {
    console.error('Download failed:', error)
    status.value = 'error'
    errorMessage.value = 'Failed to download file'
  }
}

const closeDialog = () => {
  notifyParentAndClose('dialog-closed')
}

const notifyParentAndClose = (message) => {
  try {
    // Notify parent window (Office task pane)
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'lawmatics-export', message }, '*')
    }
    
    // Close dialog if running in Office
    if (typeof Office !== 'undefined' && Office.context?.ui) {
      Office.context.ui.closeContainer()
    } else {
      // Fallback for testing outside Office
      window.close()
    }
  } catch (error) {
    console.error('Failed to notify parent or close dialog:', error)
    // Fallback
    window.close()
  }
}

useHead({
  title: 'Downloading Contacts - Lawmatics Export'
})
</script>

<style scoped>
.download-dialog {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h2 {
  margin: 0;
  color: #323130;
  font-size: 1.5rem;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.loading-state, .success-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  font-size: 3rem;
  animation: spin 2s linear infinite;
}

.success-icon, .error-icon {
  font-size: 3rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #f3f2f1;
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
}

.progress-fill {
  height: 100%;
  background-color: #0078d4;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  color: #605e5c;
}

h3 {
  margin: 0;
  color: #323130;
}

p {
  margin: 0.5rem 0;
  color: #605e5c;
}

fluent-button {
  margin: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  color: #d13438;
}

.success-state {
  color: #107c10;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .download-dialog {
    background: #1e1e1e;
    color: #ffffff;
  }
  
  .header h2, h3 {
    color: #ffffff;
  }
  
  p {
    color: #d1d1d1;
  }
  
  .progress-bar {
    background-color: #3a3a3a;
  }
}
</style>