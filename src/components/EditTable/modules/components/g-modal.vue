<template>
  <a-modal
    v-drag
    :title="title"
    v-model="visible"
    :cancelText="cancelText"
    :closable="closable"
    :confirmLoading="confirmLoading"
    :keyboard="keyboard"
    :mask="mask"
    :maskClosable="maskClosable"
    :okText="okText"
    :okType="okType"
    :width="width"
    :footer="
      customerFooter ? customerFooter : customerFooter != null ? footerT : null
    "
  >
    <template slot="footer"> </template>
    <slot>弹出框内容</slot>
  </a-modal>
</template>
<script>
export default {
  name:'gModal',
  data() {
    return {
      visible: false,
      confirmLoading: false,
      footer: (
        <span>
          <a-button key="back" onClick={this.cancel}>
            取消
          </a-button>
          <a-button key="submit" type="primary" onClick={this.ok}>
            确认
          </a-button>
        </span>
      ),
    }
  },
  watch: {
    visible(val) {
      this.$nextTick(() => {})
    },
  },
  props: {
    // 只有传null的时候才去掉footer否则都会有footer
    customerFooter: {
      default: () => '',
      type: [Object, String],
    },
    title: {
      default: '这是一弹窗!',
      type: String,
    },
    cancelText: {
      default: '取消',
      type: String,
    },
    closable: {
      default: true,
      type: Boolean,
    },
    keyboard: {
      default: false,
      type: Boolean,
    },
    mask: {
      default: true,
      type: Boolean,
    },
    maskClosable: {
      default: true,
      type: Boolean,
    },
    okText: {
      default: '确定',
      type: String,
    },
    okType: {
      default: 'primary',
      type: String,
    },
    width: {
      type: [String, Number],
      default: 1000,
    },
    slotRef: {
      type: [String, Number],
      default: '',
    },
  },
  methods: {
    show() {
      this.visible = true
    },
    cancel() {
      this.visible = false
    },
    ok() {
      this.$parent.submit()
    },
  },
}
</script>