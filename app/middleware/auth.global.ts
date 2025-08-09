// app/middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // Skip auth check during SSR
  if (import.meta.server) return

  const authStore = useAuthStore()
  const { $officeState } = useNuxtApp()

  // Skip auth check if Office.js is still loading
  if ($officeState && !$officeState.isReady) {
    return
  }

  // Skip auth for public routes (if any)
  const publicRoutes = ['/auth']
  if (publicRoutes.some(route => to.path.startsWith(route))) {
    return
  }

  // If user is not authenticated, they need to log in
  if (!authStore.isAuthenticated) {
    // Don't redirect, just let the app show the login UI
    return
  }
})