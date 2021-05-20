<template>
  <div>
    <q-card>
      <q-card-section>
        <div v-if="logo_lg">
          <q-img :src="logo_lg">
            <template v-slot:error>
              <div
                class="absolute-full flex flex-center bg-negative text-white"
              >
                Cannot load large logo
              </div>
            </template>
          </q-img>
        </div>
        <div v-if="name" class="text-h2 q-mb-xs">{{ name }}</div>
        <div class="text-h4 q-mb-xs">
          <div class="row">
            <q-avatar v-if="logo_sm">
              <q-img :src="logo_sm">
                <template v-slot:error>
                  <div
                    class="absolute-full flex flex-center bg-negative text-white"
                  >
                    E
                  </div>
                </template> </q-img
              >>
            </q-avatar>
            <div v-if="symbol" class="text-h6">{{ symbol }}</div>
          </div>
        </div>
        <div v-if="decimals" class="text-h8 q-mb-xs">{{ decimals }} decimals of precision</div>
        <div v-if="supply" class="text-h8 q-mb-xs">{{ supply.toLocaleString(undefined, { minimumFractionDigits: decimals }) }} max supply</div>
        <div v-if="owner" class="text-h8 q-mb-xs">{{ owner }} owner account</div>
        <div v-if="contract" class="text-h8 q-mb-xs">{{ contract }} contract account</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TokenDetail',
  props: {
    name: String,
    symbol: String,
    owner: String,
    contract: String,
    decimals: Number,
    supply: Number,
    logo_sm: String,
    logo_lg: String
  },
  computed: {
    ...mapGetters('accounts', ['isAuthenticated', 'account'])
  }
}
</script>
