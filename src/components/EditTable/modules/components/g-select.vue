<template>
  <div :class="show ? 'g-check-error' : ''">
    <a-tooltip placement="top">
      <a-select
        :options="options"
        :mode="mode"
        @change="change"
        :value="value"
        :labelInValue="labelInValue"
        :filterOption="filterOption"
        :showSearch="showSearch"
        :maxTagCount="maxTagCount"
        :allowClear="allowClear"
      ></a-select>
      <template slot="title" v-if="show">
        <span>{{ validate.message }}</span>
      </template>
    </a-tooltip>
  </div>
</template>
<script>
import mixin from './mixin'
export default {
  name:'gSelect',
  mixins: [mixin],
  model: {
    prop: 'value',
    event: 'change',
  },
  methods: {
    filterOption(inputValue, option) {
      if (
        option.data.props.value.toString().indexOf(inputValue) != -1 ||
        option.data.props.title.indexOf(inputValue) != -1
      ) {
        return true
      }
    },
    change(value, option) {
      // let arrs = value.map((item) => item.key)
      this.$emit('change', value)
      this.$emit('callback',{name:111})
    },
  },
  props: {
    mode: {
      type: String,
      default: 'default', // default | multiple | tags | combobox
    },
    maxTagCount: {
      type: Number,
      default: 2,
    },
    labelInValue: {
      type: Boolean,
      default: false,
    },
    showSearch: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Array,
      default: () => [
        { title: '选项一', value: 1, key: 1, disabled: false },
        { title: '选项二', value: 2, key: 2, disabled: false },
        { title: '选项三', value: 3, key: 3, disabled: false },
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
      type: [String, Number, Array],
      default: '',
    },
  },
}
</script>
<style lang="less" scoped>
.g-check-error {
  /deep/ .ant-select-selection {
    border: 1px solid #ff4d4f;
    border-width: 1px !important;
    outline: 0;
    &:hover {
      box-shadow: 0 0 0 2px rgb(245 34 45 / 20%);
    }
  }
}
/deep/ .ant-select {
  width: 100%;
}
</style>