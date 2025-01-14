// app/stores/authStore.ts
import { defineStore } from 'pinia'
import type { User } from 'firebase/auth'
import type { AsyncResult, Dialog } from '@microsoft/office-js'

interface AuthState {
  user: User | null
  isLoading: boolean
  error: Error | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  // Actions
  const loginWithGoogle = () => {
    return new Promise((resolve, reject) => {
      isLoading.value = true
      error.value = null

      // Use the absolute URL to your auth page
      const dialogUrl = import.meta.env.VITE_AUTH_URL || 'https://localhost:3000/auth.html'
      
      const dialogSettings = {
        height: 60,
        width: 30,
        displayInIframe: false
      }

      // Handle messages from dialog
      const messageHandler = (event: MessageEvent) => {
        console.log('Received message in parent:', {
          data: event.data,
          origin: event.origin,
          expectedOrigin: (new URL(dialogUrl)).origin,
          isOriginMatch: event.origin === (new URL(dialogUrl)).origin
        })

        // Only accept messages from our auth page
        if (event.origin !== (new URL(dialogUrl)).origin) return
        
        if (event.data.type === 'authComplete') {
          window.removeEventListener('message', messageHandler)
          user.value = event.data.user
          isLoading.value = false
          resolve(event.data.user)
        } else if (event.data.type === 'authError') {
          window.removeEventListener('message', messageHandler)
          error.value = new Error(event.data.error.message)
          isLoading.value = false
          reject(error.value)
        }
      }

      window.addEventListener('message', messageHandler)

      // Open the dialog
      Office.context.ui.displayDialogAsync(
        dialogUrl,
        dialogSettings,
        (result: AsyncResult<Dialog>) => {
          if (result.status === Office.AsyncResultStatus.Failed) {
            error.value = new Error(result.error.message)
            isLoading.value = false
            reject(error.value)
            return
          }

          // Get dialog instance
          const dialog = result.value

          // Handle messages from dialog
          dialog.addEventHandler(Office.EventType.DialogMessageReceived, (arg) => {
            console.info('Received message from dialog: ', arg)
            try {
              const message = JSON.parse(arg.message)
              if (message.type === 'authComplete') {
                user.value = message.user
                isLoading.value = false
                dialog.close()
                resolve(message.user)
              } else if (message.type === 'authError') {
                error.value = new Error(message.error)
                isLoading.value = false
                dialog.close()
                reject(error.value)
              }
            } catch (error) {
              console.error('Error parsing dialog message: ', error)
              error.value = newError('Invalid message from auth dialog')
              isLoading.value = false
              // dialog.close()
              reject(error.value)
            }
          })
        }
      )
    })
  }

  const logout = () => {
    user.value = null
  }

  const setError = (newError: Error) => {
    error.value = newError
    isLoading.value = false
  }

  // Return composed store
  return {
    // State
    user: readonly(user),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isAuthenticated,

    // Actions
    loginWithGoogle,
    logout,
    setError
  }
})

// Type for external use
export type AuthStoreType = ReturnType<typeof useAuthStore>