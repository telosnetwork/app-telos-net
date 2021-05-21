<template>
  <div class="q-pa-md">
    <token-detail v-bind="mapSelectedToDetails"></token-detail>
    <q-table
      title="Tokens"
      :pagination.sync="pagination"
      :data="tokens"
      :columns="columns"
      row-key="name"
      @row-click="rowClicked"
    >
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <div>
            <q-avatar rounded>
              <img :src="props.row.logo_sm" />
            </q-avatar>
            {{ props.row.token_name }}
          </div>
        </q-td>
      </template>
      <template v-slot:top-right v-if="!createToken && isAuthenticated">
        <q-btn
          color="primary"
          icon-right="plus"
          label="Create new token"
          no-caps
          @click="create"
        />
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import TokenDetail from './token-detail.vue'
export default {
  name: 'TokenList',
  components: {
    TokenDetail
  },
  data () {
    return {
      pagination: {
        rowsPerPage: 20
      },
      selectedToken: null,
      columns: [
        {
          name: 'name',
          label: 'Name',
          field: 'token_name'
        },
        {
          name: 'symbol',
          label: 'Symbol',
          field: row => row.token_symbol.split(',')[1]
        },
        {
          name: 'decimals',
          label: 'Decimals',
          field: row => row.token_symbol.split(',')[0]
        },
        {
          name: 'owner',
          label: 'Owner',
          field: 'token_owner'
        },
        {
          name: 'contract',
          label: 'Contract',
          field: 'contract_account'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('tokens', ['tokens']),
    ...mapGetters('accounts', ['isAuthenticated', 'account']),
    ...mapState('tokens', ['createToken', 'editingToken']),
    mapSelectedToDetails () {
      if (!this.selectedToken) return null

      return {
        name: this.selectedToken.token_name,
        symbol: this.selectedToken.token_symbol.split(',')[1],
        decimals: this.selectedToken.token_symbol.split(',')[0],
        owner: this.selectedToken.token_owner,
        logo_sm: this.selectedToken.logo_sm,
        logo_lg: this.selectedToken.logo_lg,
        contract: this.selectedToken.contract_account
      }
    }
  },
  methods: {
    create () {
      this.clear()
      this.$store.commit('tokens/createToken', true)
    },
    clear () {
      this.selectedToken = null
      this.$store.commit('tokens/editToken', null)
      this.$store.commit('tokens/createToken', false)
    },
    rowClicked (evt, row) {
      if (this.selectedToken === row) {
        this.clear()
      } else if (this.editingToken === row) {
        this.clear()
      } else if (row.token_owner === this.account) {
        this.clear()
        this.$store.commit('tokens/editToken', row)
      } else {
        this.clear()
        this.selectedToken = row
      }
    }
  }
}
</script>
