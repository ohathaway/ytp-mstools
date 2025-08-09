// app/stores/authStore.ts
import type { User } from 'firebase/auth'

interface AuthUser {
  email: string
  displayName: string | null
  uid: string
}

interface AuthResult {
  user: AuthUser
  idToken: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const idToken = ref<string | null>(null)

  // Create authenticated fetch wrapper
  const authenticatedFetch = async (url: string, options: any = {}) => {
    if (!idToken.value) {
      throw new Error('No authentication token available')
    }

    return $fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${idToken.value}`
      }
    })
  }

  const { $officeState } = useNuxtApp()

  const loginWithGoogle = async () => {
    isLoading.value = true
    try {
      let authResult: AuthResult

      if ($officeState?.isOfficeEnvironment) {
        // Use Office dialog for authentication in Office environment
        authResult = await new Promise((resolve, reject) => {
          // Generate CSRF state parameter
          const state = crypto.randomUUID()
          sessionStorage.setItem('authState', state)

          Office.context.ui.displayDialogAsync(
            `${window.location.origin}/auth.html?state=${state}`,
            { height: 60, width: 30, promptBeforeOpen: false },
            (result) => {
              if (result.status === Office.AsyncResultStatus.Failed) {
                reject(new Error(result.error.message))
                return
              }

              const dialog = result.value
              dialog.addEventHandler(Office.EventType.DialogMessageReceived, (arg) => {
                const message = JSON.parse(arg.message)
                
                // Verify state parameter for CSRF protection
                if (message.state !== sessionStorage.getItem('authState')) {
                  reject(new Error('Invalid state parameter'))
                  return
                }

                if (message.type === 'authComplete') {
                  resolve({
                    user: message.user,
                    idToken: message.idToken
                  })
                } else if (message.type === 'authError') {
                  reject(new Error(message.error?.message || 'Authentication failed'))
                }
                dialog.close()
              })
            }
          )
        })
      } else {
        // Fallback for browser environment (development/testing)
        // Open popup window for authentication
        authResult = await new Promise((resolve, reject) => {
          // Generate CSRF state parameter
          const state = crypto.randomUUID()
          sessionStorage.setItem('authState', state)

          const popup = window.open(
            `${window.location.origin}/auth.html?state=${state}`,
            'auth-popup',
            'width=500,height=600,scrollbars=yes,resizable=yes'
          )

          if (!popup) {
            reject(new Error('Popup blocked. Please allow popups for this site.'))
            return
          }

          // Listen for messages from popup
          const messageHandler = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return

            const message = event.data

            // Verify state parameter for CSRF protection
            if (message.state !== sessionStorage.getItem('authState')) {
              reject(new Error('Invalid state parameter'))
              return
            }

            if (message.type === 'authComplete') {
              resolve({
                user: message.user,
                idToken: message.idToken
              })
              popup.close()
              window.removeEventListener('message', messageHandler)
            } else if (message.type === 'authError') {
              reject(new Error(message.error?.message || 'Authentication failed'))
              popup.close()
              window.removeEventListener('message', messageHandler)
            }
          }

          window.addEventListener('message', messageHandler)

          // Handle popup closure
          const checkClosed = setInterval(() => {
            if (popup.closed) {
              clearInterval(checkClosed)
              window.removeEventListener('message', messageHandler)
              reject(new Error('Authentication cancelled'))
            }
          }, 1000)
        })
      }

      // Validate email domain
      if (!authResult.user.email?.endsWith('@ohlawcolorado.com')) {
        throw new Error('Invalid email domain. Must be @ohlawcolorado.com')
      }

      // Store user data and token in memory
      user.value = authResult.user
      idToken.value = authResult.idToken
      isAuthenticated.value = true
      
      // Clear auth state
      sessionStorage.removeItem('authState')

    } catch (error) {
      console.error('Login error:', error)
      // Clear any partial auth state
      user.value = null
      idToken.value = null
      isAuthenticated.value = false
      sessionStorage.removeItem('authState')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    // Clear in-memory state
    user.value = null
    idToken.value = null
    isAuthenticated.value = false
    
    // Clear any stored auth state
    sessionStorage.removeItem('authState')
  }

  const validateToken = async () => {
    if (!idToken.value) return false
    
    try {
      const response = await authenticatedFetch('/api/auth/validate')
      return !!response.valid
    } catch {
      // Token is invalid, clear auth state
      logout()
      return false
    }
  }

  return {
    // State
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    idToken: readonly(idToken),
    
    // Actions
    loginWithGoogle,
    logout,
    validateToken,
    
    // Utilities
    authenticatedFetch
  }
})