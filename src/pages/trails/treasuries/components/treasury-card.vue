<script>
import { mapGetters } from 'vuex'
import AddVoterDialog from './add-voter-dialog'
import MintTokenDialog from './mint-token-dialog'
import TreasuryEditDialog from './treasury-edit-dialog'

export default {
  name: 'treasury-card',
  components: {
    AddVoterDialog,
    MintTokenDialog,
    TreasuryEditDialog
  },
  props: {
    treasury: { type: Object, required: true }
  },
  data () {
    return {
      show: false,
      showMint: false,
      showEdit: false
    }
  },
  computed: {
    ...mapGetters('accounts', ['account', 'isAuthenticated'])
  }
}
</script>

<template lang="pug">
div
  add-voter-dialog(
    :show.sync="show"
    :supply="treasury.max_supply"
  )
  mint-token-dialog(
    :show.sync="showMint"
    :supply="treasury.max_supply"
  )
  treasury-edit-dialog(
    :show.sync="showEdit"
    :treasury="treasury"
  )
  q-card
    q-card-section.bg-primary.text-white
      .text-h6
        | {{ treasury.title || "Group" }}
        q-icon.q-ml-sm(
          :name="`fas ${treasury.access === 'private' ? 'fa-lock' : 'fa-globe'}`"
          size="12px"
        )
          q-tooltip {{ treasury.access }}
        q-icon.q-ml-sm.cursor-pointer(
          v-if="account === treasury.manager"
          name="fas fa-comment-dollar"
          @click="showMint = true"
        )
        q-icon.q-ml-sm.cursor-pointer(
          v-if="account === treasury.manager"
          name="fas fa-edit"
          @click="showEdit = true"
        )
      .text-right.text-italic {{ treasury.manager }}
    q-card-section.q-mt-lg
      p {{ treasury.description || "No desc" }}
    q-card-section
      strong {{ $t('pages.trails.treasuries.card.supply') }}: {{ treasury.supply }}
      br
      strong {{ $t('pages.trails.treasuries.card.maxSupply') }}: {{ treasury.max_supply }}
    q-card-section.flex.justify-between
      q-btn(
        icon="fas fa-person-booth"
        color="primary"
        size="sm"
        :label="`${$t('pages.trails.treasuries.card.openedBallots')} ${treasury.open_ballots}`"
        :to="`/trails/ballots?treasury=${treasury.symbol}`"
      )
      q-btn(
        v-if="isAuthenticated && !treasury.isRegistered"
        icon="fas fa-user-plus"
        color="primary"
        size="sm"
        :label="`${$t('pages.trails.treasuries.card.registerVoter')} ${treasury.voters} voters`"
        :disabled="treasury.access === 'private'"
        @click="show = true"
      )
      q-btn.cursor-inherit(
        v-if="isAuthenticated && treasury.isRegistered"
        icon="fas fa-user-check"
        color="primary"
        size="sm"
        :label="`${$t('pages.trails.treasuries.card.registered')} ${treasury.voters} voters`"
      )
</template>
