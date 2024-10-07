// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify'

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
    'vuetify/styles',
    '~/assets/css/global.scss'
  ],
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    async (options, nuxt) => {
      nuxt.hooks.hook(
        'vite:extendConfig', config => config.plugins.push(vuetify({
          autoImport: true,
          styles: {
            configFile: 'assets/css/vuetify.scss'
          }
        })
      ))
    }
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
        additionalData: `
          @use "@/assets/css/_colors.scss" as *;
          @use "@/assets/css/_variables.scss" as *;
          @use "@vuetify/lib/styles/settings/variables" as;
        `,
        api: 'modern-compiler'
      }
    },
    ssr: { noExternal: ['vuetify']}
  },
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.includes('fluent-')
    }
  }
})