import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useToastStore = defineStore('toasts', () => {
  const toastError = notification => {
    toast.error(notification, { timeout: 5000 })
  }

  const toastSuccess = notification => {
    toast.success(notification, { timeout: 5000 })
  }

  const toastWarning = notification => {
    toast.warning(notification, { timeout: 5000 })
  }

  return {
    toastError,
    toastSuccess,
    toastWarning
  }
})