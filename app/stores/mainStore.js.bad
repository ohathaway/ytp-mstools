import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'

const toast = useToast()

const toastOptions = {
  timeout: 2500,
  position: 'top-center'
}

export const useMainStore = defineStore('main', () => {
  const toastError = notification => {
    toast.error(notification.message, toastOptions)
  }

  const toastSuccess = notification => {
    toast.success(notification.message, toastOptions)
  }

  return {
    toastError,
    toastSuccess
  }
})
