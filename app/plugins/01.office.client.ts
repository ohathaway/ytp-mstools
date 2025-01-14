// app/plugins/office.client.ts
interface OfficePluginState {
  isReady: boolean
  error: Error | null
}

// Can expand this interface based on which Office.js types you need
interface OfficeApi {
  onReady: (callback: () => void) => Promise<void>
  context: any
}

declare global {
  interface Window {
    Office: OfficeApi
  }
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const state = reactive<OfficePluginState>({
    isReady: false,
    error: null
  })

  const loadOfficeJs = async (): Promise<void> => {
    try {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://appsforoffice.microsoft.com/lib/1/hosted/office.js'
        script.async = true
        script.onload = () => {
          // Once the script loads, wait for Office to be ready
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

  // Load Office.js
  await loadOfficeJs()

  return {
    provide: {
      office: window.Office,
      officeState: readonly(state)
    }
  }
})