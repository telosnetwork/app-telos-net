<script>
import { mapActions, mapGetters } from 'vuex'
import { validation } from '~/mixins/validation'

export default {
  name: 'treasury-form',
  mixins: [validation],
  props: {
    show: { type: Boolean, required: true }
  },
  data () {
    return {
      form: {
        manager: null,
        maxSupply: null,
        maxSupplyValue: null,
        maxSupplyToken: null,
        maxSupplyDecimals: null,
        access: null,
        title: null,
        description: null
      },
      submitting: false
    }
  },
  computed: {
    ...mapGetters('trails', ['treasuryFees'])
  },
  methods: {
    ...mapActions('trails', ['addTreasury', 'fetchTreasuries']),
    async onAddTreasury () {
      this.resetValidation(this.form)
      if (!(await this.validate(this.form))) return
      this.submitting = true
      const success = await this.addTreasury(this.form)
      this.submitting = false
      if (success) {
        this.$emit('update:show', false)
        this.resetTreasury()
        await this.fetchTreasuries()
      }
    },
    resetTreasury () {
      this.form = {
        manager: null,
        maxSupply: null,
        access: null,
        title: null,
        description: null
      }
    },
    setMaxSupply () {
      if (this.form.maxSupplyDecimals && parseInt(this.form.maxSupplyDecimals) > 0) {
        this.form.maxSupply = `${this.form.maxSupplyValue || 0}.${''.padStart(parseInt(this.form.maxSupplyDecimals), '0')} ${this.form.maxSupplyToken}`
      } else {
        this.form.maxSupply = `${this.form.maxSupplyValue || 0} ${this.form.maxSupplyToken}`
      }
    }
  },
  watch: {
    'form.maxSupplyValue': function () {
      this.setMaxSupply()
    },
    'form.maxSupplyToken': function () {
      this.setMaxSupply()
    },
    'form.maxSupplyDecimals': function () {
      this.setMaxSupply()
    }
  }
}
</script>

<template lang="pug">
q-dialog(
  v-model="show"
  persistent
)
  q-card(
    flat
    bordered
    style="width: 400px; max-width: 80vw;"
  )
    q-card-section.bg-primary.text-white
      .text-h6 Create a treasury
    q-card-section
      q-input(
        ref="manager"
        v-model="form.manager"
        label="Manager"
        maxlength="12"
        :rules="[rules.required, rules.accountFormat, rules.accountLength, rules.accountExists]"
        lazy-rules
        :debounce="200"
        @blur="form.manager = (form.manager || '').toLowerCase()"
      )
      .row
        q-input.col-4(
          ref="maxSupplyValue"
          v-model="form.maxSupplyValue"
          label="Max supply"
          type="number"
          :rules="[rules.required, rules.isInteger, rules.positiveInteger]"
          lazy-rules
        )
        q-input.col-4(
          ref="maxSupplyToken"
          v-model="form.maxSupplyToken"
          label="Token"
          maxlength="6"
          :rules="[rules.required, rules.isToken]"
          lazy-rules
          @keyup="form.maxSupplyToken = (form.maxSupplyToken || '').toUpperCase()"
        )
        q-input.col-4(
          ref="maxSupplyDecimals"
          v-model="form.maxSupplyDecimals"
          label="Decimals"
          type="number"
          :rules="[rules.required, rules.isInteger, rules.isTokenDecimals]"
          lazy-rules
        )
      q-input(
        ref="title"
        v-model="form.title"
        label="Title"
        maxlength="50"
        :rules="[rules.required]"
        lazy-rules
      )
      q-input(
        ref="description"
        v-model="form.description"
        label="Description"
        type="textarea"
        maxlength="250"
        :rules="[rules.required]"
        lazy-rules
      )
      q-select(
        v-model="form.access"
        label="Access"
        :options=["public", "private", "invite"]
        :rules="[rules.required]"
        lazy-rules
      )
    q-card-section(v-if="treasuryFees")
      strong.text-red.fees There is a deposit fee of {{ treasuryFees.value }}
    q-card-actions(align="right")
      q-btn(
        flat
        :label="$t('common.buttons.cancel')"
        @click="$emit('update:show', false)"
      )
      q-btn(
        color="primary"
        :label="$t('common.buttons.create')"
        :loading="submitting"
        @click="onAddTreasury()"
      )
</template>

<style lang="sass" scoped>
  .fees
    font-size: 12px
</style>
