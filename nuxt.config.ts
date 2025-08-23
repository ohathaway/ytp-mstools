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
        },
        {
          children: `
            // Office environment safety - execute immediately before any other scripts
            (function() {
              const isOfficeEnv = !!(
                (window.Office && window.Office.context) ||
                new URLSearchParams(window.location.search).get('_host_Info') ||
                new URLSearchParams(window.location.search).get('_hostname') ||
                new URLSearchParams(window.location.search).get('wdApplicationId')
              );
              
              if (isOfficeEnv) {
                console.log('🏢 Early Office detection - Disabling history API');
                
                // Create safe no-op function
                const noop = function() { return Promise.resolve(); };
                
                // Override history methods before any framework code runs
                if (window.history) {
                  Object.defineProperty(window.history, 'pushState', {
                    value: noop,
                    writable: false,
                    configurable: true
                  });
                  Object.defineProperty(window.history, 'replaceState', {
                    value: noop,
                    writable: false,
                    configurable: true
                  });
                }
                
                // Override addEventListener to block popstate
                const originalAddEventListener = window.addEventListener;
                window.addEventListener = function(type, listener, options) {
                  if (type === 'popstate') {
                    console.debug('Blocked popstate listener in Office');
                    return;
                  }
                  return originalAddEventListener.call(this, type, listener, options);
                };
              }
            })();
          `,
          type: 'text/javascript'
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
    '~/assets/css/global.css'
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
  // Suppress warnings for dual-mode architecture (Office vs Browser)
  features: {
    // Disable page/layout warnings since we use conditional rendering
    inlineStyles: false
  },
  modules: [
    '@nuxthub/core',
    '@pinia/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins?.push(vuetify({ 
          autoImport: true
        }))
      })
    }
  ],
  nitro: {
    experimental: {
      openAPI: true
    },
    preset: 'cloudflare-pages'
  },
  router: {
    options: {
      // Office Add-ins work better with hash mode to avoid navigation issues
      hashMode: true,
      // Additional safety for Office environments
      scrollBehavior: () => ({ left: 0, top: 0 }),
      // Prevent router from interfering with Office environment
      sensitive: false,
      strict: false
    }
  },
  // Experimental: disable SSR router in client-side to prevent Office issues
  experimental: {
    payloadExtraction: false
  },
  runtimeConfig: {
    basicAuth: process.env.BASIC_AUTH,
    lawmaticsToken: process.env.LAWMATICS_TOKEN,
    lawmaticsUrl: process.env.LAWMATICS_URL,
    public: {
      // lmFunction: 'lmGetData',
      lmFunction: 'api/lawmatics',
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
      },
      appBrowserUrl: process.env.NODE_ENV === 'development' ? 'https://127.0.0.1:3000' : 'https://tools.ohlawcolorado.com'
    }
  },
  ssr: false,
  vite: {
    build: {
      target: 'es2015',
      rollupOptions: {
        output: {
          // Reduce dynamic imports that cause issues in Office environment
          manualChunks: undefined
        }
      }
    },
    devtools: true,
    optimizeDeps: {
      include: ['@fluentui/web-components', '@microsoft/fast-foundation']
    },
    ssr: { noExternal: ['vuetify']}
  },
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.includes('fluent-')
    }
  }
})