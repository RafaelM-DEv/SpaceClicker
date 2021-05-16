import VueGtag from 'vue-gtag'

export default async ({ Vue, router }) => {
  Vue.use(VueGtag, {
    config: { id: 'G-VJ4P0XP56Q' }
  }, router)
}
