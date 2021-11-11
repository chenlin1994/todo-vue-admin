<template>
  <a-divider :type="type">
    <slot></slot>
  </a-divider>
</template>
<script>
export default {
  name:'gDivider',
  props: {
    type: {
      type: String,
      default: 'vertical',
    },
    dashed: {
      type: Boolean,
      default: false,
    },
    orientation: {
      type: String,
      default: 'left',
    },
  },
}
</script>