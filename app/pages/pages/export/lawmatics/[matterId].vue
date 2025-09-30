<template>
  <div class="export-page">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-card class="mx-auto" elevation="8">
            <v-card-title class="text-h5 text-center pa-6">
              <v-icon class="me-2" color="primary">mdi-download</v-icon>
              Export Lawmatics Contacts
            </v-card-title>

            <!-- Loading State -->
            <v-card-text v-if="status === 'loading'" class="text-center py-8">
              <v-progress-circular
                indeterminate
                color="primary"
                size="64"
                class="mb-4"
              ></v-progress-circular>
              <h3 class="text-h6 mb-2">{{ statusMessage }}</h3>
              <v-progress-linear
                :value="progress"
                color="primary"
                height="8"
                rounded
                class="mb-2"
              ></v-progress-linear>
              <p class="text-body-2 text-medium-emphasis">{{ progress }}% Complete</p>
            </v-card-text>

            <!-- Success State -->
            <v-card-text v-else-if="status === 'completed'" class="text-center py-8">
              <v-icon color="success" size="64" class="mb-4">mdi-check-circle</v-icon>
              <h3 class="text-h6 mb-2">Export Complete!</h3>
              <p class="text-body-1 mb-4">{{ statusMessage }}</p>
              <v-chip v-if="filename" color="primary" variant="outlined" class="mb-4">
                <v-icon start>mdi-file-document</v-icon>
                {{ filename }}
              </v-chip>
              
              <div class="d-flex flex-column gap-3">
                <v-btn
                  color="primary"
                  size="large"
                  variant="elevated"
                  @click="downloadFile"
                  :disabled="!csvData"
                  block
                >
                  <v-icon start>mdi-download</v-icon>
                  Download CSV
                </v-btn>
                
                <v-btn
                  color="secondary"
                  variant="outlined"
                  @click="goHome"
                  block
                >
                  <v-icon start>mdi-home</v-icon>
                  Return to App
                </v-btn>
              </div>
            </v-card-text>

            <!-- Error State -->
            <v-card-text v-else-if="status === 'error'" class="text-center py-8">
              <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
              <h3 class="text-h6 mb-2">Export Failed</h3>
              <p class="text-body-1 mb-4">{{ errorMessage }}</p>
              
              <div class="d-flex flex-column gap-3">
                <v-btn
                  color="primary"
                  variant="elevated"
                  @click="startExport"
                  block
                >
                  <v-icon start>mdi-refresh</v-icon>
                  Try Again
                </v-btn>
                
                <v-btn
                  color="secondary"
                  variant="outlined"
                  @click="goHome"
                  block
                >
                  <v-icon start>mdi-home</v-icon>
                  Return to App
                </v-btn>
              </div>
            </v-card-text>

            <!-- Initial State -->
            <v-card-text v-else class="text-center py-8">
              <v-icon color="primary" size="64" class="mb-4">mdi-file-export</v-icon>
              <h3 class="text-h6 mb-2">Ready to Export</h3>
              <p class="text-body-1 mb-4">Export contacts for Matter ID: {{ matterId }}</p>
              
              <v-btn
                color="primary"
                size="large"
                variant="elevated"
                @click="startExport"
                :loading="isStarting"
                block
              >
                <v-icon start>mdi-play</v-icon>
                Start Export
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
// Page metadata
definePageMeta({
  title: 'Export Lawmatics Contacts',
  layout: 'default'
})

// Get matter ID from route params
const route = useRoute()
const matterId = route.params.matterId as string

// Reactive state
const status = ref<'idle' | 'loading' | 'completed' | 'error'>('idle')
const progress = ref(0)
const statusMessage = ref('Preparing export...')
const errorMessage = ref('')
const filename = ref('')
const csvData = ref('')
const isStarting = ref(false)
const exportId = ref('')

let pollInterval: ReturnType<typeof setInterval> | null = null

// Auth setup - determine if we're in external browser or main app
const { $toast } = useNuxtApp()
let authenticatedFetch: any
let isExternalBrowser = false

// Check if this is an external browser (no auth store available or autostart=true)
const urlParams = new URLSearchParams(window.location.search)
const hasAutostart = urlParams.get('autostart') === 'true'

try {
  // Try to use main app auth store
  const authStore = useAuthStore()
  if (!hasAutostart && authStore.isAuthenticated) {
    // Main app context with valid auth
    authenticatedFetch = authStore.authenticatedFetch
    console.log('Using main app auth store')
  } else {
    throw new Error('External browser mode or not authenticated')
  }
} catch (error) {
  // External browser mode - create independent auth
  isExternalBrowser = true
  console.log('Using independent auth for external browser')
  
  // Check for stored auth token
  const storedAuth = import.meta.client ? localStorage.getItem('ohlaw_auth_token') : null
  let authToken = ''
  
  if (storedAuth) {
    try {
      const authData = JSON.parse(storedAuth)
      const tokenAgeHours = (Date.now() - authData.timestamp) / (1000 * 60 * 60)
      
      console.log('Stored auth found:', { 
        email: authData.user?.email, 
        tokenAge: `${tokenAgeHours.toFixed(2)} hours`,
        hasToken: !!authData.idToken
      })
      
      if (tokenAgeHours < 24 && authData.idToken) {
        authToken = authData.idToken
        console.log('Using stored auth token')
      } else {
        console.log('Stored auth token expired or missing')
      }
    } catch (error) {
      console.error('Error parsing stored auth:', error)
    }
  } else {
    console.log('No stored auth found')
  }
  
  // Create independent authenticated fetch
  authenticatedFetch = async (url: string, options: any = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }
    
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        // Redirect to auth if not authenticated
        console.log('Authentication required, redirecting to auth page')
        const authUrl = `/auth.html?redirect=${encodeURIComponent(window.location.href)}`
        window.location.href = authUrl
        throw new Error('Authentication required')
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    return response.json()
  }
}

// Start export process
const startExport = async () => {
  if (isStarting.value) return

  isStarting.value = true
  status.value = 'loading'
  progress.value = 0
  statusMessage.value = 'Starting export...'
  errorMessage.value = ''

  try {
    // Start server-side export
    const response = await authenticatedFetch('/api/lawmatics/export-contacts', {
      method: 'POST',
      body: { matterId }
    })

    exportId.value = response.exportId
    startPolling()

  } catch (error) {
    console.error('Failed to start export:', error)
    status.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : 'Failed to start export'
  } finally {
    isStarting.value = false
  }
}

// Start polling for status
const startPolling = () => {
  pollStatus()
  pollInterval = setInterval(pollStatus, 1000)
}

// Stop polling
const stopPolling = () => {
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
}

// Poll status from server
const pollStatus = async () => {
  try {
    const response = await authenticatedFetch(`/api/lawmatics/export-status/${exportId.value}`)
    
    progress.value = response.progress || 0
    statusMessage.value = response.message || 'Processing...'
    filename.value = response.filename || ''

    if (response.status === 'completed') {
      status.value = 'completed'
      stopPolling()
      
      // Get the CSV data
      await fetchCsvData()
      
    } else if (response.status === 'error') {
      status.value = 'error'
      errorMessage.value = response.error || 'Export failed'
      stopPolling()
    }

  } catch (error) {
    console.error('Polling error:', error)
    status.value = 'error'
    errorMessage.value = 'Failed to check export status'
    stopPolling()
  }
}

// Fetch CSV data when ready
const fetchCsvData = async () => {
  try {
    const response = await authenticatedFetch(`/api/download/lawmatics-csv/${exportId.value}`)
    csvData.value = response
  } catch (error) {
    console.error('Failed to fetch CSV data:', error)
  }
}

// Download the CSV file
const downloadFile = () => {
  if (!csvData.value || !filename.value) return

  try {
    // Create blob and download
    const blob = new Blob([csvData.value], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    
    // Create download link
    const link = document.createElement('a')
    link.href = url
    link.download = filename.value
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up
    URL.revokeObjectURL(url)
    
    $toast?.success('CSV file downloaded successfully!')
    
  } catch (error) {
    console.error('Download failed:', error)
    $toast?.error('Failed to download file')
  }
}

// Navigate to app home
const goHome = () => {
  navigateTo('/')
}

// Cleanup on unmount
onUnmounted(() => {
  stopPolling()
})

// Auto-start export if coming from Office environment
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const autoStart = urlParams.get('autostart')
  
  if (autoStart === 'true') {
    startExport()
  }
})
</script>

<style scoped>
.export-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.v-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}
</style>