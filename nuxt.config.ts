// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/ohlaw_icon.svg'
        }
      ],
      script: [
        { src: 'https://appsforoffice.microsoft.com/lib/1.1/hosted/office.js' },
        { 
          type: 'module',
          src: 'https://unpkg.com/@fluentui/web-components'
        }
      ]
    }
  },
  build: {
    transpile: [
      'vue-toastification',
      'vuetify'
    ]
  },
  buildModules: ['@nuxtjs/svg'],
  compatibilityDate: '2024-04-03',
  css: [
    '~/assets/css/global.scss',
    'vuetify/styles'
  ],
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    'vuetify-nuxt-module'
  ],
  runtimeConfig: {
    public: {
      lmBasicAuth: process.env.BASIC_AUTH,
      lmFunction: 'lmGetData'
    }
  },
  ssr: false,
  vite: {
    optimizeDeps: {
      include: ['@fluentui/web-components']
    },
    preprocessorOptions: {
      scss: { 
        api: 'modern-compiler'
      }
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.includes('-')
    }
  }
})