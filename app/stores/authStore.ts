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

interface StoredAuth {
  user: AuthUser
  idToken: string
  timestamp: number
}

const STORAGE_KEY = 'ohlaw_auth_token'
const TOKEN_MAX_AGE = 24 * 60 * 60 * 1000 // 24 hours

const storeAuth = (user: AuthUser, idToken: string) => {
  if (!import.meta.client) return
  
  const authData: StoredAuth = {
    user,
    idToken,
    timestamp: Date.now()
  }
  
  console.log('Storing auth data:', { 
    email: user.email, 
    timestamp: new Date(authData.timestamp).toISOString(),
    key: STORAGE_KEY 
  })
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authData))
  
  // Verify it was stored
  const verification = localStorage.getItem(STORAGE_KEY)
  console.log('Storage verification:', !!verification)
}

const loadStoredAuth = async (): Promise<StoredAuth | null> => {
  if (!import.meta.client) return null
  
  try {
    console.log('Loading stored auth with key:', STORAGE_KEY)
    const stored = localStorage.getItem(STORAGE_KEY)
    console.log('Raw stored data:', !!stored)
    
    if (!stored) {
      console.log('No stored auth data found')
      return null
    }
    
    const authData: StoredAuth = JSON.parse(stored)
    console.log('Parsed auth data:', { 
      email: authData.user?.email, 
      timestamp: new Date(authData.timestamp).toISOString(),
      ageHours: (Date.now() - authData.timestamp) / (1000 * 60 * 60)
    })
    
    // Check if token is too old
    if (Date.now() - authData.timestamp > TOKEN_MAX_AGE) {
      console.log('Token is too old, removing')
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    
    return authData
  } catch (error) {
    console.error('Failed to load stored auth:', error)
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY)
    }
    return null
  }
}

const clearStoredAuth = () => {
  if (!import.meta.client) return
  localStorage.removeItem(STORAGE_KEY)
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

    try {
      return await $fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${idToken.value}`
        }
      })
    } catch (error: any) {
      // If we get a 401, the token is likely expired - clear auth state
      if (error?.response?.status === 401) {
        console.log('Received 401, token likely expired - signing out')
        await logout()
        throw new Error('Authentication expired. Please sign in again.')
      }
      throw error
    }
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
            console.debug('message.state:', message.state)
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
      
      // Store auth data in localStorage for persistence
      storeAuth(authResult.user, authResult.idToken)
      
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
    
    // Clear stored auth
    clearStoredAuth()
    
    // Clear any session storage
    sessionStorage.removeItem('authState')
  }

  const validateToken = async (token?: string) => {
    const tokenToValidate = token || idToken.value
    console.log('Validating token:', { 
      hasToken: !!tokenToValidate, 
      tokenLength: tokenToValidate?.length,
      isCustomToken: !!token 
    })
    
    if (!tokenToValidate) {
      console.log('No token to validate')
      return false
    }
    
    try {
      console.log('Making validation request to /api/auth/validate')
      const response = await $fetch('/api/auth/validate', {
        headers: {
          Authorization: `Bearer ${tokenToValidate}`
        }
      })
      console.log('Validation response:', response)
      return !!response.valid
    } catch (error) {
      console.error('Token validation error:', error)
      // Token is invalid, clear auth state if it was the current token
      if (!token) {
        logout()
      }
      return false
    }
  }

  const initializeAuth = async () => {
    if (!import.meta.client) return false
    
    console.log('Initializing auth, checking for stored credentials...')
    
    const storedAuth = await loadStoredAuth()
    if (storedAuth) {
      console.log('Found stored auth:', { 
        email: storedAuth.user.email, 
        timestamp: new Date(storedAuth.timestamp).toISOString(),
        hasToken: !!storedAuth.idToken 
      })
      
      // Check if token is very old (more than 1 hour) - likely expired
      const tokenAgeHours = (Date.now() - storedAuth.timestamp) / (1000 * 60 * 60)
      if (tokenAgeHours > 1) {
        console.log(`Token is ${tokenAgeHours.toFixed(2)} hours old, likely expired - clearing storage`)
        clearStoredAuth()
        return false
      }
      
      // For relatively fresh tokens (under 1 hour), restore auth state
      // The first API call will validate the token and trigger logout if invalid
      console.log('Restoring auth state with stored token')
      user.value = storedAuth.user
      idToken.value = storedAuth.idToken
      isAuthenticated.value = true
      return true
    } else {
      console.log('No stored auth found')
      return false
    }
  }

  // Initialize auth on client side
  if (import.meta.client) {
    initializeAuth()
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
    initializeAuth,
    
    // Utilities
    authenticatedFetch
  }
})