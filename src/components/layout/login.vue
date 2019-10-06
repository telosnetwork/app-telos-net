<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'login',
  data () {
    return {
      show: false,
      error: null
    }
  },
  computed: {
    ...mapGetters('accounts', ['loading', 'isAutoLoading'])
  },
  methods: {
    ...mapActions('accounts', ['login']),
    async onLogin (idx) {
      this.error = null
      const error = await this.login(idx)
      if (!error) {
        this.show = false
      } else {
        this.error = error
      }
    },
    openUrl (url) {
      window.open(url)
    }
  }
}
</script>

<template lang="pug">
div
  q-btn(
    :label="$t('components.layout.login.button')"
    flat
    @click="show = true"
    :loading="isAutoLoading"
  )
  q-dialog(
    v-model="show"
  )
    q-card(style="width: 400px; max-width: 80vw;")
      q-card-section
        .text-h6.text-center {{ $t('components.layout.login.title') }}
      q-card-section
        q-list
          q-item(
            v-for="(wallet, idx) in $ual.authenticators"
            :key="wallet.getStyle().text"
            v-ripple
            :style="{ background: wallet.getStyle().background, color: wallet.getStyle().textColor }"
          )
            q-item-section.cursor-pointer(
              avatar
              @click="onLogin(idx)"
            )
              img(
                :src="wallet.getStyle().icon"
                width="30"
              )
            q-item-section.cursor-pointer(@click="onLogin(idx)") {{ wallet.getStyle().text }}
            q-item-section(avatar)
              .flex
                q-spinner(
                  v-if="loading === wallet.getStyle().text"
                  :color="wallet.getStyle().textColor"
                  size="2em"
                )
                q-btn(
                  v-else
                  :color="wallet.getStyle().textColor"
                  icon="get_app"
                  @click="openUrl(wallet.getOnboardingLink())"
                  target="_blank"
                  dense
                  flat
                  size="12px"
                )
                  q-tooltip {{ $t('components.layout.login.getApp') }}
          q-item(
            v-if="error"
            :active="!!error"
            active-class="bg-red-1 text-grey-8"
          )
            q-item-section {{ error }}
</template>
