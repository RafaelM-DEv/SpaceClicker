import VueGtag from 'vue-gtag'

export default async ({ Vue, router }) => {
  Vue.use(VueGtag, {
    config: { id: 'UA-154707501-1' }
  }, router)
}
