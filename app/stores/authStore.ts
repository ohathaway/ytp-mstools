// app/stores/authStore.ts
import type { User } from 'firebase/auth'

interface AuthUser {
  email: string
  displayName: string | null
  uid: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)

  const loginWithGoogle = async () => {
    isLoading.value = true
    try {
      // Open the Office dialog for Firebase auth
      const result = await new Promise((resolve, reject) => {
        Office.context.ui.displayDialogAsync(
          `${window.location.origin}/auth.html`,
          { height: 60, width: 30, promptBeforeOpen: false },
          (result) => {
            if (result.status === Office.AsyncResultStatus.Failed) {
              reject(new Error(result.error.message))
              return
            }

            const dialog = result.value
            dialog.addEventHandler(Office.EventType.DialogMessageReceived, (arg) => {
              const message = JSON.parse(arg.message)
              if (message.type === 'authComplete') {
                resolve(message.user)
              } else if (message.type === 'authError') {
                reject(message.error)
              }
              dialog.close()
            })
          }
        )
      })

      // Validate and create session
      if (!result.email?.endsWith('@ohlawcolorado.com')) {
        throw new Error('Invalid email domain. Must be @ohlawcolorado.com')
      }

      const response = await $fetch('/api/auth/sessions', {
        method: 'POST',
        body: {
          email: result.email,
          displayName: result.displayName
        }
      })

      if (response.success) {
        user.value = {
          email: result.email,
          displayName: result.displayName,
          uid: result.uid
        }
        isAuthenticated.value = true
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const checkSession = async () => {
    try {
      const response = await $fetch('/api/auth/validate')
      if (response.user) {
        user.value = response.user
        isAuthenticated.value = true
      }
    } catch (error) {
      user.value = null
      isAuthenticated.value = false
    }
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      user.value = null
      isAuthenticated.value = false
    }
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    
    // Actions
    loginWithGoogle,
    checkSession,
    logout
  }
})