<template>
  <div :class="show ? 'g-check-error' : ''">
    <a-tooltip placement="top">
      <a-checkbox-group
        :size="size"
        @change="change"
        :value="value"
        :options="options"
      >
      </a-checkbox-group>
      <template slot="title" v-if="show">
        <span>{{ validate.message }}</span>
      </template>
    </a-tooltip>
  </div>
</template>
<script>
import mixin from './mixin'
export default {
  name:'gCheckbox',
  mixins:[mixin],
  model: {
    prop: 'value',
    event: 'change',
  },
  methods: {
    change(value) {
      this.$emit('change', value)
    },
  },
  props: {
    size: {
      type: String,
      default: 'large', // large | default | small
    },
    options: {
      type: Array,
      default: () => [
        { label: '男', value: 1, disabled: false },
        { label: '女', value: 2, disabled: false },
      ],
    },
    validate: {
      type: Object,
      default: () => ({
        required: false,
        message: '',
      }),
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
<style lang="less" scoped>
.g-check-error {
  /deep/ .ant-checkbox-group {
    border: 1px solid #ff4d4f;
    border-width: 1px !important;
    outline: 0;
    &:hover {
      box-shadow: 0 0 0 2px rgb(245 34 45 / 20%);
    }
  }
}
</style>