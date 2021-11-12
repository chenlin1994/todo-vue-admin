<template>
  <a-modal :visible="visible" @ok="submit" @cancel="cancel" title="用户">
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="用户名" prop="username">
        <a-input v-model="form.username" />
      </a-form-model-item>
      <a-form-model-item label="密码" prop="password">
        <a-input v-model="form.password" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
import listDialogMixin from './listDialogMixin'
export default {
  mixins: [listDialogMixin],
  data() {
    let validatePass = (rule, value, callback) => {
      if (/^[a-zA-Z\d]{8,20}$/.test(value)) {
        callback()
      } else {
        callback(new Error('密码应为8到20位字母或数字！'))
      }
    }
    let validateUsername = (rule, value, callback) => {
      if (
        /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value) ||
        /^1[3456789]\d{9}$/.test(value)
      ) {
        callback()
      } else {
        callback(new Error('请输入正确的邮箱/手机号'))
      }
    }
    return {
      form: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'change' },
          { validator: validateUsername, trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { validator: validatePass, trigger: 'blur' },
        ],
      },
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    }
  },
}
</script>