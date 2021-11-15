<template>
  <a-form-model
    :ref="formKey"
    :model="form"
    :layout="layout"
    :rules="rules"
    :hideRequiredMark="hideRequiredMark"
    :labelAlign="labelAlign"
    :labelCol="labelCol"
    :wrapperCol="wrapperCol"
  >
    <a-row :gutter="8">
      <a-col :span="8">
        <a-form-model-item label="关键字" prop="name">
          <a-input v-model="form.keyword" />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="年龄" prop="age">
          <a-input-number v-model="form.age" />
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="日期" prop="date">
          <a-date-picker
            v-model="form.date"
            valueFormat="YYYY-MM-DD"
            :disabled-date="disabledDate"
            :showTime="false"
          ></a-date-picker>
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="时间" prop="dateRange">
          <a-range-picker
            allowClear
            v-model="form.dateRange"
            valueFormat="YYYY-MM-DD"
            :disabled-date="disabledDate"
            :showTime="false"
          ></a-range-picker>
        </a-form-model-item>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :span="8">
        <a-form-model-item label="选择" prop="select">
          <a-select v-model="form.select" :options="options"></a-select>
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item label="开关" prop="switch">
          <a-switch v-model="form.switch"></a-switch>
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-form-model-item
          label="请选择人员"
          prop="name"
          :labelCol="{ span: 8 }"
        >
          <g-popup
            v-model="form.name"
            :columns="{ name: '姓名', uid: '账号', email: '邮箱' }"
            :rawFields="['name', 'id', 'uid']"
            :keyMap="{ name: 'name', id: 'id', uid: 'uid1' }"
            :record="form"
            conChar=","
            url="/poros-permission/secStaff/list"
            :showIndex="true"
            @callback="(obj) => submit_callback(form, obj, ['uid1', 'id'])"
          >
            <template v-slot:default="{ loadData }">
              <g-search @search="loadData"></g-search>
            </template>
          </g-popup>
        </a-form-model-item>
      </a-col>
    </a-row>
    <a-row :gutter="8">
      <a-col :span="8">
        <a-form-model-item>
          <a-button type="primary" @click="$emit('search', form)"
            >搜索</a-button
          >
          <a-divider type="vertical" />
          <a-button type="primary" @click="reset">重置</a-button>
        </a-form-model-item>
      </a-col>
    </a-row>
  </a-form-model>
</template>
<script>
import gPopup from './g-popup'
import _ from 'lodash'
import moment from 'moment'
export default {
  name: 'gSearch',
  data() {
    let customerCheck = (rule, value, callback) => {
      if (value) {
        callback()
      } else {
        callback(new Error('必填'))
      }
    }
    return {
      formKey: 'formDemo',
      form: {
        keyword: '22',
        age: '',
        gender: '',
        date: '',
        dateRange: [],
        select: '',
        switch: false,
        name: '',
        id: '',
        uid1: '',
      },
      options: [
        {
          label: '选项一',
          value: 1,
        },
        {
          label: '选项二',
          value: 2,
        },
      ],
      rules: {},
    }
  },
  components: {
    gPopup,
  },
  props: {
    layout: {
      type: String,
      default: 'horizontal', // horizontal | vertical | inline
    },
    record: {
      type: Object,
      default: () => ({}),
    },
    // 隐藏所有表单项的必选标记
    hideRequiredMark: {
      type: Boolean,
      default: false,
    },
    // label 标签的文本对齐方式
    labelAlign: {
      type: String,
      default: 'right', // right | left
    },
    // label 标签布局，同 <Col> 组件
    labelCol: {
      type: Object,
      default: () => ({ span: 6 }),
    },
    wrapperCol: {
      type: Object,
      default: () => ({ span: 4 }),
    },
    // 是否在 rules 属性改变后立即触发一次验证
    validateOnRuleChange: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    console.log('moment', moment(), '11', moment().endOf('day'))
  },
  methods: {
    disabledDate(current) {
      console.log(current)
      return current && current < moment().subtract(1, 'day').endOf('day')
    },
    reset() {
      this.$refs[this.formKey].resetFields()
      this.$emit('search', {})
    },
    submit_callback(form, obj, keys) {
      for (var i of keys) {
        form[i] = ''
      }
      obj.forEach((item, index) => {
        for (var i of keys) {
          form[i] =
            String(form[i]) +
            String(item[i]) +
            (obj.length - 1 == index ? '' : ',') // conChar
        }
      })
      console.log(_.pick(form, ['id', 'name', 'uid1']))
    },
    submit(callback) {
      console.log('form submit')
      this.$refs[this.formKey].validate((valid) => {
        if (valid) {
          callback()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    validate(callback) {
      this.$refs[this.formKey].validate((valid, params) => {
        if (valid) {
          callback()
        } else {
          console.log(params)
          return false
        }
      })
    },
    // 对部分表单字段进行校验
    validateField(array) {
      this.$refs[this.formKey].validateField(array, (errorMessage) => {
        this.$message.warning(errorMessage)
      })
    },
    // 对表单进行重置 所有字段重置为初始值并移除校验结果
    resetFields() {
      this.$refs[this.formKey]()
    },
    // 移除表单校验结果  如不传参则移除整个表单的校验结果
    clearValidate(array) {
      this.$refs[this.formKey](array)
    },
  },
}
</script>
<style lang="less" scoped>
/deep/ .ant-input-number {
  width: 100%;
}
/deep/ .ant-row.ant-form-item {
  display: flex;
}
</style>