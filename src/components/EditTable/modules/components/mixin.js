import _ from 'lodash'
export default {
  inject: ['provObj'],
  watch: {
    value: {
      handler(val, oldValue) {
        if (this.isEmpty(val) && this.validate.required) {
          this.provObj.checkVal(1)
        } else if (this.isEmpty(oldValue) && this.validate.required) {
          this.provObj.checkVal(-1)
        }
      },
    },
  },
  created() {
    this.isEmpty(this.value) && this.validate.required
      ? this.provObj.checkVal(1)
      : ''
  },
  beforeDestroy() {
    this.isEmpty(this.value) && this.validate.required
      ? this.provObj.checkVal(-1)
      : ''
  },
  computed: {
    show() {
      return this.provObj &&
        this.provObj.errorCheck &&
        this.validate.required &&
        this.isEmpty(this.value) &&
        (this.provObj.index == this.index || this.provObj.index == null)
        ? true
        : false
    },
  },
  methods: {
    isEmpty(val) {
      if (typeof val == 'object') {
        return _.isEmpty(val)
      } else {
        return !val
      }
    },
  },
  props: {
    index: {
      type: [String, Number],
      default: '',
    },
    allowClear: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: '请输入',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'large', // large | default | small
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // 自定义验证
    customerValidator: {
      validator: function(value) {
        return typeof value == 'array'
      },
    },
    validate: {
      type: Object,
      default: () => ({
        required: false,
        message: '',
      }),
    },
  },
}
