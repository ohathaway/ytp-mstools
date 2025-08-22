// app/plugins/04.suppress-warnings.client.ts
export default defineNuxtPlugin({
  name: 'suppress-warnings',
  setup() {
    // Override console.warn to suppress specific Nuxt warnings that don't apply to our dual-mode architecture
    const originalWarn = console.warn
    console.warn = (...args) => {
      const message = args.join(' ')
      
      // Suppress page/layout warnings since we intentionally use conditional rendering
      if (message.includes('Your project has pages but the `<NuxtPage />` component has not been used') ||
          message.includes('Your project has layouts but the `<NuxtLayout />` component has not been used')) {
        return // Suppress these warnings
      }
      
      // Allow all other warnings through
      originalWarn.apply(console, args)
    }
  }
})