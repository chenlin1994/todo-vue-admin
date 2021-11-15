<template>
  <div :class="show ? 'g-check-error' : ''">
    <a-tooltip placement="top">
      <template v-if="['date', 'dateTime'].includes(type)">
        <a-date-picker
          :size="size"
          :disabledDate="disabledDate"
          :value="value"
          @change="change"
          :format="format"
          :valueFormat="valueFormat"
          :showTime="type == 'dateTime' ? true : false"
        ></a-date-picker>
      </template>
      <template v-else-if="['dateRange', 'dateTimeRange'].includes(type)">
        <a-range-picker
          @change="change"
          :size="size"
          :disabledDate="disabledDate"
          :format="format"
          :valueFormat="valueFormat"
          :showTime="type == 'dateTimeRange' ? true : false"
        ></a-range-picker>
      </template>
      <template slot="title" v-if="show">
        <span>{{ validate.message }}</span>
      </template>
    </a-tooltip>
  </div>
</template>
<script>
import moment from 'moment'
import mixin from './mixin'
export default {
  name:'gDate',
  mixins: [mixin],
  model: {
    prop: 'value',
    event: 'change',
  },
  methods: {
    disabledDate(current) {
      return current && current < moment().subtract(1, 'day').endOf('day')
    },
    change(date, dateStr) {
      this.$emit('change', date === null ? '' : date)
    },
  },
  props: {
    size: {
      type: String,
      default: 'large', // large | default | small
    },
    format: {
      type: [String, Array],
      default: 'YYYY-MM-DD',
    },
    valueFormat: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    validate: {
      type: Object,
      default: () => ({
        required: false,
        message: '',
      }),
    },
    type: {
      type: String,
      default: 'date', // date | dateRange | dateTime | dateTimeRange
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
  /deep/ .ant-calendar-picker,
  .ant-calendar-picker {
    border: 1px solid #ff4d4f;
    border-width: 1px !important;
    outline: 0;
    &:hover {
      box-shadow: 0 0 0 2px rgb(245 34 45 / 20%);
    }
  }
}
/deep/ .ant-input[readonly='true'] {
  background: none;
}
</style>