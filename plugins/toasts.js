import { ref, computed } from 'vue'

export default defineNuxtPlugin(() => {
  const toasts = ref([])
  let nextId = 0

  const activeToasts = computed(() => toasts.value.slice(-3))

  const addToast = (message, type = 'info') => {
    const toast = {
      id: nextId++,
      message,
      type
    }
    toasts.value.push(toast)
    setTimeout(() => removeToast(toast.id), 3000)
  }

  const removeToast = id => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const toast = {
    activeToasts,
    addToast,
    removeToast
  }

  return {
    provide: {
      toast
    }
  }
})