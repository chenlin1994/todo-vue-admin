<template>
  <div>
    <a-switch
      @change="change"
      :checked="checked"
      :unCheckedChildren="unCheckedChildren"
      :checkedChildren="checkedChildren"
    ></a-switch>
  </div>
</template>
<script>
export default {
  name:'gSwitch',
  model: {
    prop: 'value',
    event: 'change',
  },
  computed: {
    checked() {
      return ['', undefined, null, 0, '0'].includes(this.value) ? false : true
    },
  },
  methods: {
    change(checked, event) {
      this.$emit('change', checked ? 1 : 0)
    },
  },
  props: {
    size: {
      type: String,
      default: 'large', // large | default | small
    },
    checkedChildren: {
      type: String,
      default: '是',
    },
    unCheckedChildren: {
      type: String,
      default: '否',
    },
    value: {
      type: [String, Number],
      default: 0,
    },
  },
}
</script>
<style lang="less" scoped>
.g-check-error {
  /deep/ .ant-radio-group {
    border: 1px solid #ff4d4f;
    border-width: 1px !important;
    outline: 0;
    &:hover {
      box-shadow: 0 0 0 2px rgb(245 34 45 / 20%);
    }
  }
}
</style>