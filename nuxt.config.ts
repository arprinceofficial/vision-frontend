import Aura from '@primeuix/themes/aura'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    '~~/assets/css/fonts.css',
    '~~/assets/css/main.css',
    'primeicons/primeicons.css'
  ],
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxt/icon',
    '@primevue/nuxt-module',
    '@nuxtjs/color-mode'
  ],
  colorMode: {
    preference: 'light',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    },
    components: {
      include: '*'
    }
  },
  app: {
    head: {
      title: 'The Car Crowd - Invest in Collectible Classic Cars',
      meta: [
        {
          name: 'description',
          content:
            'Unlock access to rare and historical collectible automobiles through fractional ownership of vetted investment-grade cars.'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/svg/TCC-Logo.svg' }
      ]
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 3001
  }
})
