<template>
  <a-modal :visible="visible" @ok="submit" @cancel="cancel">
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="姓名" prop="name">
        <a-input v-model="form.name" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
import listDialogMixin from './listDialogMixin'
export default {
  mixins: [listDialogMixin],
  data() {
    return {
      form: {
        name: '',
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
      },
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    }
  },
}
</script>