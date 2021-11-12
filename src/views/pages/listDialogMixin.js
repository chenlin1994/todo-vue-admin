export default {
  data() {
    return {
      visible: false,
      form: {},
    }
  },
  methods: {
    init() {
      this.visible = true
      this.$refs.form.resetFields()
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('submit', submit)
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
