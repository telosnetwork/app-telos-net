import LayoutMain from '../layouts/main.vue'
import LayoutEmpty from '../layouts/empty.vue'
import LayoutGuest from '../layouts/guest.vue'

export default async ({ Vue }) => {
  Vue.component('layout-main', LayoutMain)
  Vue.component('layout-empty', LayoutEmpty)
  Vue.component('layout-guest', LayoutGuest)
}
