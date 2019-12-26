import VueAnalytics from 'vue-analytics'

export default async ({ app, router, store, Vue }) => {
  Vue.use(VueAnalytics, {
    id: `${process.env.GOOGLE_ANALYTICS}`,
    router
  })
}
