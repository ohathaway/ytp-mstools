// app/composables/useAuthFetch.ts
export const useAuthFetch = () => {
  const authStore = useAuthStore()

  const authFetch = async (url: string, options: any = {}) => {
    return authStore.authenticatedFetch(url, options)
  }

  return {
    authFetch
  }
}