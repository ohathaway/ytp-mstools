// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  buildModules: ['@nuxtjs/svg'],
  compatibilityDate: '2024-04-03',
  css: [
    '@/assets/css/global.css'
  ],
  devtools: { enabled: true },
  head: {
    script: [
      'https://appsforoffice.microsoft.com/lib/1.1/hosted/office.js'
    ]
  },
  ssr: false,
  vue: {
    compilerOptions: {
      isCustomElement: tag => ['-'].includes(tag)
    }
  }
})
