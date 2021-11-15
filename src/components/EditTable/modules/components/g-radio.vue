<template>
  <div :class="show ? 'g-check-error' : ''">
    <a-tooltip placement="top">
      <a-radio-group
        :size="size"
        @change="change"
        :value="value"
        :options="type == 'radio' ? options : null"
        :buttonStyle="buttonStyle"
      >
        <a-radio-button
          v-for="item in options"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </a-radio-button>
      </a-radio-group>
      <template slot="title" v-if="show">
        <span>{{ validate.message }}</span>
      </template>
    </a-tooltip>
  </div>
</template>
<script>
import mixin from './mixin'
export default {
  name:'gRadio',
  mixins:[mixin],
  computed: {
    show() {
      return this.provObj.errorCheck &&
        this.validate.required &&
        !this.value.toString()
        ? true
        : false
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  methods: {
    change(e) {
      this.$emit('change', e.target.value)
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
    buttonStyle: {
      type: String,
      default: 'solid',
    },
    type: {
      type: String,
      default: 'radio', // radio | button
    },
    value: {
      type: [String, Number],
      default: '',
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