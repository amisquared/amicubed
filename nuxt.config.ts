// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/fonts', '@nuxt/content'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },

      meta: [
        { property: 'og:site_name', content: 'amicubed' },
        { name: 'author', content: 'amicubed' }
      ],

      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/icon-32.png' },
        { rel: 'icon', type: 'image/png', sizes: '256x256', href: '/icon-256.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: 'amicubed',
          href: '/rss.xml'
        }
      ]
    }
  }
})