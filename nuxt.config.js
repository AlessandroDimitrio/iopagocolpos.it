export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: true,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'IoUsoIlPos.it',
    htmlAttrs: {
      lang: 'it'
    },
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'IoUsoIlPos.it è il nuovo portale per segnalare attività che non accettano pagamenti con carta'
      },
      {
        name: 'format-detection',
        content: 'telephone=no'
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/static/global.css',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
      '@nuxtjs/google-fonts'
  ],
  
  googleFonts: {
    prefetch: true,
    download: true,
    families: {
      Inter: true,
    }
  },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: "#3b8070"
  },

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{
    src: "~/plugins/google-maps",
    ssr: true
  }],

  /*
   ** Build configuration
   */
  build: {
    transpile: [/^vue2-google-maps($|\/)/]
  }
}
