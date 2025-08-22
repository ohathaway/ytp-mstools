// app/plugins/office.client.ts
interface OfficePluginState {
  isReady: boolean
  error: Error | null
  isOfficeEnvironment: boolean
}

interface OfficeApi {
  onReady: (callback: () => void) => Promise<void>
  context: any
}

declare global {
  interface Window {
    Office: OfficeApi
  }
}

export default defineNuxtPlugin({
  name: 'office',
  async setup(nuxtApp) {
  // Early environment detection to prevent unnecessary loading
  const isOfficeEnv = process.client && 
    !!(window.Office && window.Office.context)

  const state = reactive<OfficePluginState>({
    isReady: false,
    error: null,
    isOfficeEnvironment: isOfficeEnv
  })

  const checkOfficeEnvironment = (): boolean => {
    // Office Add-ins include these URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    return !!(
      urlParams.get('_host_Info') || 
      urlParams.get('_hostname') ||
      // Can also check for other Office-specific parameters
      urlParams.get('wdApplicationId')
    )
  }

  const loadOfficeJs = async (): Promise<void> => {
    try {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://appsforoffice.microsoft.com/lib/1/hosted/office.js'
        script.async = true
        script.onload = () => {
          window.Office?.onReady(() => {
            state.isReady = true
            resolve()
          })
        }
        script.onerror = () => reject(new Error('Failed to load Office.js'))
        document.head.appendChild(script)
      })
    } catch (error) {
      state.error = error instanceof Error ? error : new Error('Unknown error loading Office.js')
      throw state.error
    }
  }

  // Wait for router and other critical plugins
  await nuxtApp.isHydrating

  // Check if we're in Office environment
  state.isOfficeEnvironment = checkOfficeEnvironment()

  // Only load Office.js if we're in Office environment
  if (state.isOfficeEnvironment) {
    await loadOfficeJs()
  } else {
    state.isReady = true // Mark as ready even without Office.js
  }

    return {
      provide: {
        office: window.Office,
        officeState: readonly(state)
      }
    }
  }
})