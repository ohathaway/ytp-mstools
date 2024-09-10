export default defineNuxtPlugin(() => {
  return {
    provide: {
      toast: useToast()
    }
  }
})