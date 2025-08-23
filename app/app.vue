<template>
  <!-- Dual-mode architecture: completely separate rendering paths -->
  
  <!-- Office Mode: Static components only, no dynamic imports -->
  <OfficeApp v-if="isOfficeEnvironment" />
  
  <!-- Browser Mode: Full-featured web app with routing and layouts -->
  <NuxtLayout v-else>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Critical: Environment detection MUST happen before any other imports or logic
const isOfficeEnvironment = process.client && 
  !!(window.Office && window.Office.context)

console.log('Environment detected:', isOfficeEnvironment ? 'Office Add-in' : 'Browser')

// Enhanced error handling for Office environment
if (process.client) {
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error)
    console.error('Error details:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      environment: isOfficeEnvironment ? 'Office' : 'Browser'
    })
    
    // In Office environment, prevent crashes more aggressively
    if (isOfficeEnvironment) {
      event.preventDefault()
      event.stopPropagation()
    }
  })

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    console.error('Environment:', isOfficeEnvironment ? 'Office' : 'Browser')
    
    if (isOfficeEnvironment) {
      event.preventDefault()
    }
  })
}

// Static import for Office component
import OfficeApp from '~/components/OfficeApp.vue'

// Only access Nuxt app context in browser mode to prevent Office issues
const nuxtApp = !isOfficeEnvironment ? useNuxtApp() : null
const $officeState = nuxtApp?.$officeState

// Initialize authentication state only in appropriate environment
onMounted(() => {
  if (!isOfficeEnvironment) {
    // Browser mode: full initialization
    if (!$officeState || $officeState.isReady) {
      // Token-based auth initialization for browser mode
    }
  } else {
    // Office mode: minimal initialization
    console.log('Office Add-in initialized in simplified mode')
  }
})
</script>
