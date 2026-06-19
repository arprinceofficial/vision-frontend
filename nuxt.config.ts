import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      NUXT_PUBLIC_SITE_URL: process.env.NUXT_PUBLIC_SITE_URL,
      API_URL_ADMIN: process.env.API_URL_ADMIN,
      API_URL_CITIZEN: process.env.API_URL_CITIZEN,
      CMS_EMAIL: process.env.CMS_EMAIL,
      CMS_PASSWORD: process.env.CMS_PASSWORD,
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    '~~/assets/fa-6.4.0/css/all.css',
    '~~/assets/css/fonts.css',
    '~~/assets/scss/style.scss',
    '~~/assets/css/main.css',
    'primeicons/primeicons.css',
  ],
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxt/icon',
    '@primevue/nuxt-module',
    '@nuxtjs/color-mode',
  ],
  vite: {
    optimizeDeps: {
      include: ['quill', 'quill-delta'],
    },
  },
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
  },
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
    components: {
      include: '*',
    },
  },
  app: {
    head: {
      title: 'The Car Crowd - Invest in Collectible Classic Cars',
      meta: [
        {
          name: 'description',
          content:
            'Unlock access to rare and historical collectible automobiles through fractional ownership of vetted investment-grade cars.',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/svg/TCC-Logo.svg',
        },
      ],
    },
  },
  devServer: {
    host: '0.0.0.0',
    port: 3001,
  },
});
