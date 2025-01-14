// plugins/error-handler.js
export default defineNuxtPlugin(() => {
  console.info('Nuxt app intializing...')
  if (process.client) {
    window.onerror = function(message, source, lineno, colno, error) {
      console.error('Global error:', { message, source, lineno, colno, error })
    }
    window.onunhandledrejection = (event) => {
      console.error('Unhandled rejection: ', event.reason)
    }
  }
})