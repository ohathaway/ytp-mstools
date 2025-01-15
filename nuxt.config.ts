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
        // { src: 'https://appsforoffice.microsoft.com/lib/1/hosted/office.js' },
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
  devServer: {
    https: {
      key: './doc/devkey.pem',
      cert: './doc/devcert.pem'
    },
    host: 'localhost'
  },
  devtools: { enabled: true, force: true },
  future: { 
    compatibilityVersion: 4,
    typescriptBundlerResolution: true
  },
  hub: {
    database: true,
    kv: true
  },
  logLevel: 'verbose',
  modules: [
    '@nuxthub/core',
    '@pinia/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins?.push(vuetify({ 
          autoImport: true,
        }))
      })
    }
  ],
  nitro: {
    preset: 'cloudflare'
  },
  router: {
    options: {
      // Office Add-ins require hash mode
      hashMode: false
    }
  },
  runtimeConfig: {
    public: {
      lmBasicAuth: process.env.BASIC_AUTH,
      lmFunction: 'lmGetData',
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
      },
    }
  },
  ssr: false,
  vite: {
    build: {
      target: 'es2015'
    },
    devtools: true,
    optimizeDeps: {
      include: ['@fluentui/web-components', '@microsoft/fast-foundation']
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