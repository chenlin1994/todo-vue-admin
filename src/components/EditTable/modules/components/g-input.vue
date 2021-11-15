<template>
  <div :class="show ? 'g-check-error' : ''">
    <a-tooltip placement="top">
      <template>
        <a-input
          :value="value"
          v-if="type == 'textarea'"
          type="textarea"
          @change="(e) => change(e.target.value)"
          @pressEnter="enterCallback"
          :allowClear="allowClear"
        ></a-input>
        <a-input
          :value="value"
          v-if="type == 'normal'"
          @change="(e) => change(e.target.value)"
          @pressEnter="enterCallback"
          :allowClear="allowClear"
        ></a-input>
        <a-input-number
          :value="value"
          v-if="type == 'number'"
          @change="(value) => change(value)"
          :allowClear="allowClear"
        ></a-input-number>
      </template>
      <template slot="title" v-if="show">
        <span>{{ validate.message }}</span>
      </template>
    </a-tooltip>
  </div>
</template>
<script>
import mixin from './mixin'
export default {
  name: 'gInput',
  // provObj.errorCheck 提交验证  checkVal校验
  mixins: [mixin],
  model: {
    prop: 'value',
    event: 'input',
  },
  methods: {
    change(value) {
      this.$emit('input', value)
    },
  },
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: [String, Number],
      default: 'normal',
    },
    validate: {
      type: Object,
      default: () => ({
        required: false,
        message: '',
      }),
    },
    enterCallback: {
      type: Function,
      default: () => {},
    },
  },
}
</script>
<style lang="less" scoped>
.g-check-error {
  /deep/ .ant-input,
  input,
  textarea,
  .ant-input-number {
    border-color: #ff4d4f;
    border-width: 1px !important;
    outline: 0;
    &:hover {
      box-shadow: 0 0 0 2px rgb(245 34 45 / 20%) !important;
    }
    &:focus {
      box-shadow: 0 0 0 2px rgb(245 34 45 / 20%) !important;
    }
  }
}
/deep/ .ant-input-suffix{
  z-index: 0;
}
</style>