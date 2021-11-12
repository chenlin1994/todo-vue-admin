import { postAction, getAction, putAction, deleteAction } from '@/utils/network'
export default {
  data() {
    return {
      visible: false,
      form: {},
    }
  },
  watch: {
    visible(val) {
      !val && this.$refs.form.resetFields()
    },
  },
  methods: {
    init(form) {
      this.visible = true
      this.$nextTick(() => {
        for (let i in this.form) {
          if (this.form.hasOwnProperty(i)) {
            this.form[i] = form[i]
          }
        }
      })
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.form)
        } else {
          return false
        }
      })
    },
    cancel() {
      this.visible = false
    },
  },
}
