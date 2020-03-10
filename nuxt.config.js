/*!

=========================================================
* Nuxt Argon Dashboard PRO - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nuxt-argon-dashboard-pro
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by www.creative-tim.com and www.binarcode.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
require('dotenv').config()
import axios from 'axios'

const info = {
  title: '부시로드 성우 정보',
  description: '부시로드 미디어 프로젝트들의 성우 정보를 정리한 사이트입니다.'
}

module.exports = {
  mode: 'universal',
  router: {
    base: '/',
    linkExactActiveClass: 'active',
    middleware: ['ssr-cookie']
  },
  /*
  ** Headers of the page
  */
  head: {
    title: info.title,
    titleTemplate: '%s - 부시로드 성우 정보',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: info.description },
      { hid: 'og:title', name: 'og:title', content: info.title },
      { hid: 'og:description', name: 'og:description', content: info.description },
      { hid: 'og:site_name', name: 'og:site_name', content: info.title },
      { hid: 'og:image', name: 'og:image', content: 'https://bushiroad.seiyuus.com/img/brand/logo-gray.png' },
      { hid: 'og:type', name: 'og:type', content: 'website' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Noto+Sans+JP:300,400,700|Noto+Sans+KR:300,400,700|Open+Sans:300,400,600,700&display=swap&subset=japanese,korean'},
      { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.6.3/css/all.css', integrity: "sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/", crossorigin: "anonymous"}
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  //loading: { color: '#fff' },
  loading: '~/components/loading.vue',
  /*
  ** Global CSS
  */
  css: [
    'assets/css/nucleo/css/nucleo.css',
    'assets/sass/argon.scss'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/dashboard/dashboard-plugin',
    '~/node_modules/vanilla-back-to-top',
    {src: '~/plugins/dashboard/full-calendar', ssr: false },
    {src: '~/plugins/dashboard/no-ssr-plugins', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/sentry',
    ['@nuxtjs/google-analytics', {
      id: 'UA-148921044-1'
    }],
    '@nuxtjs/sitemap'
  ],
  sentry: {
    disabled: process.env.NODE_ENV !== 'production',
    config: {
      environment: process.env.SENTRY_ENV,
      disabled: process.env.NODE_ENV !== 'production'
    }
  },
  sitemap: {
    hostname: `https://${process.env.DOMAIN}`,
    gzip: true,
    exclude: [
      '/forgot',
      '/reset',
      '/admin/**',
      '**/edit/**',
      '/-maps/**',
      '/-pages/**'
    ],
    routes: async () => {
      let routes = []

      const discographies = await axios.get('https://bushiroad.seiyuus.com/api/discography/list')
      const goods = await axios.get('https://bushiroad.seiyuus.com/api/goods/list')
      const seiyuus = await axios.get('https://bushiroad.seiyuus.com/api/seiyuu/list')
      const translations = await axios.get('https://bushiroad.seiyuus.com/api/translation/list')

      routes = [
        ...discographies.data.map(discography => `/discographies/${discography.title}`),
        ...goods.data.map(good => `/goods/${good.name}`),
        ...seiyuus.data.map(seiyuu => `/seiyuu/${seiyuu.name}`),
        ...translations.data.map(translation => `/translation/${translation.title}`),
        '/karaoke/release/tj', '/karaoke/release/kumyoung', '/karaoke/release/joysound', '/karaoke/release/dam', '/karaoke/release/uga',
        '/seiyuu/sp/bandori', '/seiyuu/sp/revue', '/seiyuu/sp/d4dj', '/seiyuu/sp/rebirth', '/seiyuu/sp/assaultlily'
      ]
      
      return routes
    }
  },
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    proxy: true
  },

  /*
  ** Build configuration
  */
  build: {
    //analyze: (process.env.NODE_ENV !== 'production') ? false : true,
    transpile: [
      'vee-validate/dist/rules'
    ],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      if (ctx && ctx.isClient) config.optimization.splitChunks.maxSize = 51200
    },
    filenames: {  
      app: ({ isDev }) => isDev ? '[name].[hash].js' : '[chunkhash].js',  
      chunk: ({ isDev }) => isDev ? '[name].[hash].js' : '[chunkhash].js' 
    },
    extractCSS: process.env.NODE_ENV === 'production',
    babel: {
      plugins: [
        [
          "component",
          {
            "libraryName": "element-ui",
            "styleLibraryName": "theme-chalk"
          }
        ]
      ]
    }
  },
  serverMiddleware: [ '~/api' ],
  server: { port: (process.env.NODE_ENV !== 'production') ? 6000 : 3000 }
}
