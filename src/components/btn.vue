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
    :class="primary ? undefined : 'border-btn'"
    :to="to ? to : undefined"
    :style="{'width': `${btnWidth}px`, 'font-size': `${fontSize}px`}"
    @click="clickBtn"
    :label="labelText"
    :color="primary ? 'primary' : 'blue'"
    :text-color="primary ? 'white' : 'accent'"
    :icon-right="iconRight ? 'img:statics/icons/plus.svg' : undefined"
    no-caps
    :outline="primary ? false : true"
  )
</template>

<style lang="sass">
  .q-btn
    border-radius: 6px
  .border-btn .q-btn__content
    color: $dark
</style>
