// app/plugins/03.router-office-guard.client.ts
export default defineNuxtPlugin({
  name: 'router-office-guard',
  enforce: 'pre',
  setup(nuxtApp) {
    // Office environment detection
    const isOfficeEnvironment = !!(
      window.Office && window.Office.context ||
      new URLSearchParams(window.location.search).get('_host_Info') ||
      new URLSearchParams(window.location.search).get('_hostname') ||
      new URLSearchParams(window.location.search).get('wdApplicationId')
    )

    if (isOfficeEnvironment) {
      console.log('🏢 Office environment detected - Implementing router safety measures')
      
      // Store original methods before overriding
      const originalHistory = window.history
      const originalPushState = originalHistory.pushState
      const originalReplaceState = originalHistory.replaceState
      const originalAddEventListener = window.addEventListener

      // Create safe no-op history methods
      const safeHistoryMethod = function() {
        console.debug('History method called in Office environment - ignoring')
        return undefined
      }

      // Override history methods immediately
      try {
        Object.defineProperty(window.history, 'pushState', {
          value: safeHistoryMethod,
          writable: false,
          configurable: true
        })
        
        Object.defineProperty(window.history, 'replaceState', {
          value: safeHistoryMethod,
          writable: false,
          configurable: true
        })
      } catch (error) {
        console.warn('Could not override history methods:', error)
      }

      // Override addEventListener to block popstate listeners
      window.addEventListener = function(type: string, listener: any, options?: any) {
        if (type === 'popstate') {
          console.debug('Blocked popstate listener in Office environment')
          return
        }
        return originalAddEventListener.call(this, type, listener, options)
      }

      // Override any router creation by intercepting the Vue Router constructor
      if (window.Vue) {
        const originalCreateRouter = window.Vue.createRouter
        if (originalCreateRouter) {
          window.Vue.createRouter = function(options: any) {
            console.log('Intercepting router creation for Office environment')
            return originalCreateRouter({
              ...options,
              history: {
                push: safeHistoryMethod,
                replace: safeHistoryMethod,
                go: () => {},
                back: () => {},
                forward: () => {},
                listen: () => () => {},
                destroy: () => {},
                location: { fullPath: '/' },
                state: {}
              }
            })
          }
        }
      }
    }
  }
})