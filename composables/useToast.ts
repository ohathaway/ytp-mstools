// composables/useToast.ts
import { ref, computed } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

const toasts = ref<Toast[]>([])
let nextId = 0

export const useToast = () => {
  const activeToasts = computed(() => toasts.value.slice(-3))

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const toast: Toast = {
      id: nextId++,
      message,
      type,
    }
    toasts.value.push(toast)
    setTimeout(() => removeToast(toast.id), 3000)
  }

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    activeToasts,
    addToast,
    removeToast,
  }
}