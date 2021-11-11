<template>
  <span class="g-span">{{ value }}</span>
</template>
<script>
export default {
  name:'gSpan',
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
  },
}
</script>
<style lang="less" scoped>
.g-span {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>