// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        { src: 'https://appsforoffice.microsoft.com/lib/1.1/hosted/office.js' }
      ]
    }
  },
  buildModules: ['@nuxtjs/svg'],
  compatibilityDate: '2024-04-03',
  css: [
    '@/assets/css/global.css'
  ],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      lmBasicAuth: process.env.LM_GET_DATA_TOKEN
    }
  },
  ssr: false,
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.includes('-')
    }
  }
})
