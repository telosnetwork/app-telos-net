<script>
export default {
  name: 'btn',
  props: {
    primary: Boolean,
    labelText: String,
    btnWidth: String,
    iconRight: Boolean,
    fontSize: String,
    to: String,
    type: String,
    hoverBlue: Boolean,
    disable: Boolean
  },
  methods: {
    clickBtn: function () { this.$emit('clickBtn') }
  }
}
</script>

<template lang="pug">
  q-btn.custom-btn(
    :class="`${primary ? undefined : 'border-btn'} ${hoverBlue ? 'hover-blue' : undefined}`"
    :to="to ? to : undefined"
    :style="{'width': `${btnWidth}px`, 'font-size': `${fontSize}px`}"
    @click="clickBtn"
    :label="labelText"
    :color="primary ? 'primary' : 'blue'"
    :text-color="primary ? 'white' : 'info'"
    :icon-right="iconRight ? 'ti-plus' : undefined"
    no-caps
    :outline="primary ? false : true"
    :type="type"
    :disable="disable ? false : true"
  )
</template>

<style lang="sass">
  .q-btn
    border-radius: 6px
  .border-btn .q-btn__content
    color: $dark
  .custom-btn > .q-btn__wrapper
    padding: 0
  .hover-blue
    & > .q-btn__wrapper:hover
      background: var(--q-color-primary)
    & > .q-btn__wrapper:hover > .q-btn__content
      color: #fff
</style>
