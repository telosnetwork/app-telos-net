import LayoutAuth from '../layouts/auth.vue'
import LayoutEmpty from '../layouts/empty.vue'
import LayoutGuest from '../layouts/guest.vue'

export default async ({ Vue }) => {
  Vue.component('layout-auth', LayoutAuth)
  Vue.component('layout-empty', LayoutEmpty)
  Vue.component('layout-guest', LayoutGuest)
}
