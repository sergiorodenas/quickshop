// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Only include the modules we need
  modules: [
    '@nuxt/image-edge',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon'
  ],

  // Static generation settings
  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/products',
        '/categories',
        '/success',
        '/canceled'
      ],
      concurrency: 10,
      interval: 1000,
      failOnError: false,
    },
    static: true,
    routeRules: {
      '/**': { static: true }
    }
  },

  runtimeConfig: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    public: {
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    }
  },

  app: {
    head: {
      script: [
        {
          src: 'https://js.stripe.com/v3/',
          defer: true
        }
      ]
    }
  },

  // Define our components
  components: [
    {
      path: './components',
      pathPrefix: false
    }
  ]
});
