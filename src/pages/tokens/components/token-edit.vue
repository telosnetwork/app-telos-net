<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card>
      <div class="text-h6">
        {{ editingToken ? "Edit your token's info" : "Create a new token" }}
      </div>
      <q-card-section>
        <q-input v-model="token.name" label="Token name"></q-input>
        <q-input
          v-model="token.symbol"
          counter
          :readonly="!!editingToken"
          label="Symbol"
          @input="
            val => (token.symbol = val.toUpperCase().replace(/[^A-Z]/g, ''))
          "
          :rules="[
            !!val || '* Required',
            val => val.length <= 6 || 'Symbols can only be 6 characters'
          ]"
        ></q-input>
        <q-input
          v-model.number="token.decimals"
          type="number"
          :readonly="!!editingToken"
          label="Decimals"
          :rules="[
            !!val || '* Required',
            val =>
              (val && val <= 9) || 'Can only have up to 9 decimals of precision'
          ]"
        ></q-input>
        <q-input
          v-model.number="token.supply"
          type="number"
          v-if="createToken && token.decimals"
          label="Max supply"
          @input="
            val =>
              token.decimals &&
              (token.supply = parseFloat(val.toFixed(token.decimals)))
          "
          :rules="[
            !!val || '* Required',
            val =>
              parseInt(val.toFixed(token.decimals).replace(/\./g, '')) <
                4611686018427388000 ||
              '* supply (without decimals) must be less than 4611686018427388000'
          ]"
        ></q-input>
        <q-input v-model="token.logo_sm" label="Small logo URL"></q-input>
        <q-input v-model="token.logo_lg" label="Large logo URL"></q-input>
      </q-card-section>
      <q-card-section>
        <div class="text-h6">Balance: {{ balance }} {{ token.symbol }}</div>
      </q-card-section>
      <q-card-section>
        <q-card-actions>
          <q-btn flat @click="submit">{{
            createToken ? `Create for ${this.config.create_price}` : "Save"
          }}</q-btn>
          <q-btn flat @click="cancelEdit">Cancel</q-btn>
          <q-btn-dropdown v-if="!createToken" color="primary" label="Manage Tokens">
            <q-list>
              <q-item v-if="canIssue()" clickable v-close-popup @click="onItemClick">
                <q-item-section>
                  <q-item-label>Issue</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="hasBalance()" clickable v-close-popup @click="onItemClick">
                <q-item-section>
                  <q-item-label>Retire</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="hasBalance()" clickable v-close-popup @click="onItemClick">
                <q-item-section>
                  <q-item-label>Transfer</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-card-actions>
      </q-card-section>
    </q-card>
    <token-detail
      :name="token.name"
      :symbol="token.symbol"
      :decimals="token.decimals"
      :supply="token.supply"
      :logo_sm="token.logo_sm"
      :logo_lg="token.logo_lg"
    ></token-detail>
  </div>
</template>

<script>
import TokenDetail from './token-detail.vue'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'TokenEdit',
  components: {
    TokenDetail
  },
  data () {
    return {
      token: {
        name: null,
        symbol: null,
        decimals: null,
        supply: null,
        logo_sm: null,
        logo_lg: null
      },
      balance: null,
      stat: null
    }
  },
  computed: {
    ...mapState('tokens', ['createToken', 'editingToken', 'config']),
    ...mapGetters('accounts', ['account'])
  },
  mounted () {
    this.setToken()
  },
  watch: {
    editingToken (val) {
      this.setToken()
    }
  },
  methods: {
    canIssue () {
      return this.stat && this.getUnissued() > 0
    },
    getUnissued () {
      return parseFloat(this.stat.max_supply.split(' ')[0]) - parseFloat(this.stat.supply.split(' ')[0])
    },
    hasBalance () {
      return parseFloat(this.balance.split(' ')[0]) > 0
    },
    async submit () {
      if (this.createToken) {
        this.submitCreate()
      } else {
        this.submitSetMeta()
      }
    },
    async setStat () {
      if (!this.editingToken) return

      let result = await this.$store.$api.getTableRows({
        code: this.editingToken.contract_account,
        scope: this.editingToken.token_symbol.split(',')[1],
        table: 'stat'
      })
      if (result.rows.length) {
        this.stat = result.rows[0]
      } else {
        this.stat = null
      }
    },
    async setBalance () {
      if (!this.editingToken) return

      let result = await this.$store.$api.getTableRows({
        code: this.editingToken.contract_account,
        scope: this.account,
        table: 'accounts',
        lower_bound: this.editingToken.token_symbol.split(',')[1]
      })
      if (result.rows.length) {
        this.balance = result.rows[0].balance
      } else {
        this.balance = (0).toFixed(
          parseInt(this.editingToken.token_symbol.split(',')[0])
        )
      }
    },
    async submitSetMeta () {
      const transaction = await this.$store.$api.signTransaction([
        {
          account: process.env.TOKENMANAGER_CONTRACT,
          name: 'setmeta',
          data: {
            token_symbol: this.editingToken.token_symbol,
            token_name: this.token.name,
            logo_sm: this.token.logo_sm,
            logo_lg: this.token.logo_lg
          }
        }
      ])
      if (transaction) {
        this.showTransaction = true
        this.transaction = transaction.transactionId
      }
    },
    async submitCreate () {
      const actions = [
        {
          account: process.env.TOKENMANAGER_CONTRACT,
          name: 'openacct',
          data: {
            account_name: this.accountName.toLowerCase()
          }
        },
        {
          account: 'eosio.token',
          name: 'transfer',
          data: {
            from: this.accountName.toLowerCase(),
            to: process.env.TOKENMANAGER_CONTRACT,
            quantity: this.config.create_price,
            memo: `Payment for creating ${this.token.name} (${this.token.symbol}) token`
          }
        },
        {
          account: process.env.TOKENMANAGER_CONTRACT,
          name: 'createtoken',
          data: {
            owner: this.accountName.toLowerCase(),
            token_name: this.token.name,
            max_supply: `${this.token.supply.toFixed(this.token.decimals)} ${
              this.token.symbol
            }`,
            logo_sm: this.token.logo_sm,
            logo_lg: this.token.logo_lg
          }
        }
      ]
      const transaction = await this.$store.$api.signTransaction(actions)
      if (transaction) {
        this.showTransaction = true
        this.transaction = transaction.transactionId
      }
    },
    setToken () {
      if (this.editingToken) {
        this.token.name = this.editingToken.token_name
        this.token.symbol = this.editingToken.token_symbol.split(',')[1]
        this.token.decimals = parseInt(
          this.editingToken.token_symbol.split(',')[0]
        )
        this.token.logo_sm = this.editingToken.logo_sm
        this.token.logo_lg = this.editingToken.logo_lg
        this.setBalance()
        this.setStat()
      } else {
        this.token = {}
      }
    },
    cancelEdit () {
      this.$store.commit('tokens/createToken', false)
      this.$store.commit('tokens/editToken', null)
    }
  }
}
</script>
