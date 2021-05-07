<script>
export default {
  name: 'btn',
  props: {
    primary: Boolean,
    labelText: String,
    btnWidth: String,
    iconRight: Boolean,
    fontSize: String,
    to: String
  },
  methods: {
    clickBtn: function () { this.$emit('clickBtn') }
  }
}
</script>

<template lang="pug">
  q-btn(
    :to="to ? to : undefined"
    :style="{'width': `${btnWidth}px`, 'font-size': `${fontSize}px`}"
    @click="clickBtn"
    :label="labelText"
    :color="primary ? 'primary' : 'white'"
    :text-color="primary ? 'white' : 'dark'"
    :icon-right="iconRight ? 'img:statics/icons/plus.svg' : undefined"
    no-caps
  )
</template>

<style lang="sass" scoped>
  .q-btn
    border-radius: 6px
</style>
