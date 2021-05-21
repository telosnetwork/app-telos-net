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
            val => !!val || '* Required',
            val => val <= 9 || 'Can only have up to 9 decimals of precision'
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
          lazy-rules
          :rules="[
            val => !!val || '* Required',
            val => {
              return (
                parseInt(val.toFixed(token.decimals).replace(/\./g, '')) <
                  4611686018427388000 ||
                '* supply (without decimals) must be less than 4611686018427388000'
              );
            }
          ]"
        ></q-input>
        <q-input v-model="token.logo_sm" label="Small logo URL"></q-input>
        <q-input v-model="token.logo_lg" label="Large logo URL"></q-input>
      </q-card-section>
      <q-card-section>
        <div class="text-h6">Balance: {{ balance }}</div>
      </q-card-section>
      <q-card-section>
        <q-card-actions>
          <q-btn flat @click="submit">{{
            createToken ? `Create for ${this.config.create_price}` : "Save"
          }}</q-btn>
          <q-btn flat @click="cancelEdit">Cancel</q-btn>
          <q-btn-dropdown
            v-if="!createToken"
            color="primary"
            label="Manage Tokens"
          >
            <q-list>
              <q-item
                v-if="canIssue()"
                clickable
                v-close-popup
                @click="issueDialog = true"
              >
                <q-item-section>
                  <q-item-label>Issue</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                v-if="hasBalance()"
                clickable
                v-close-popup
                @click="retireDialog = true"
              >
                <q-item-section>
                  <q-item-label>Retire</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                v-if="hasBalance()"
                clickable
                v-close-popup
                @click="transferDialog = true"
              >
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

    <q-dialog v-model="issueDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Issue</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Issue more {{ this.token.symbol }} tokens
        </q-card-section>
        <q-card-section>
          <q-input
            v-model.number="toIssue"
            type="number"
            label="To issue"
            :placeholder="`Max - ${getUnissued()}`"
            :rules="[
              val => !!val || '* Required',
              val =>
                val <= this.getUnissued() ||
                `Can only issue ${this.getUnissued()}`
            ]"
          ></q-input>
          <q-input v-model="issueMemo" label="Memo"> </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Issue" color="primary" @click="doIssue" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
          repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis
          perferendis totam, ea at omnis vel numquam exercitationem aut, natus
          minima, porro labore.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
          repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis
          perferendis totam, ea at omnis vel numquam exercitationem aut, natus
          minima, porro labore.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import TokenDetail from './token-detail.vue'
import { mapState, mapGetters, mapActions } from 'vuex'
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
        logo_lg: null,
        contract_account: null,
        owner: null
      },
      balance: null,
      stat: null,
      transferDialog: false,
      issueDialog: false,
      retireDialog: false,
      toIssue: null,
      toRetire: null,
      toTransfer: null,
      issueMemo: null,
      retireMemo: null,
      transferMemo: null
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
    ...mapActions('tokens', [
      'setMeta',
      'loadTokens',
      'createToken',
      'issueTokens',
      'retireTokens',
      'transferTokens'
    ]),
    canIssue () {
      return this.stat && this.getUnissued() > 0
    },
    getUnissued () {
      return (
        parseFloat(this.stat.max_supply.split(' ')[0]) -
        parseFloat(this.stat.supply.split(' ')[0])
      )
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
          `${parseInt(this.editingToken.token_symbol.split(',')[0])} ${this.editingToken.token_symbol.split(',')[1]}`
        )
      }
    },
    async submitSetMeta () {
      await this.setMeta({
        symbol: this.editingToken.token_symbol,
        name: this.token.name,
        logoSm: this.token.logo_sm,
        logoLg: this.token.logo_lg
      })
      this.loadTokens()
    },
    async submitCreate () {
      await this.createToken({
        ...this.token,
        create_price: this.config.create_price
      })
      this.loadTokens()
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
        this.token.contract_account = this.editingToken.contract_account
        this.token.owner = this.editingToken.token_owner
        this.setBalance()
        this.setStat()
      } else {
        this.token = {}
      }
    },
    async doIssue () {
      await this.issueTokens({
        ...this.token,
        contractAccount: this.token.contract_account,
        memo: this.issueMemo,
        amount: this.toIssue
      })
      this.setBalance()
      this.setStat()
      this.issueDialog = false
    },
    cancelEdit () {
      this.$store.commit('tokens/createToken', false)
      this.$store.commit('tokens/editToken', null)
    }
  }
}
</script>
