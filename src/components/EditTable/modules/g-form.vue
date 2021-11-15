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
      <template v-for="(item, key, index) in data">
        <a-col
          :span="item.span || 8"
          :key="index"
          v-if="typeof item === 'object'"
        >
          <a-form-model-item
            :label="item.label ? item.label : '表单域'"
            :prop="key"
            :labelCol="item.labelCol ? item.labelCol : labelCol"
            :wrapperCol="item.wrapperCol ? item.wrapperCol : wrapperCol"
          >
            <template v-if="['input', 'textarea'].includes(item.type)">
              <a-input
                v-model="form[key]"
                :type="item.type == 'textarea' ? 'textarea' : ''"
              />
            </template>
            <template v-else-if="item.type == 'number'">
              <a-input-number v-model="form[key]"></a-input-number>
            </template>
            <template v-else-if="item.type == 'radio'">
              <a-radio-group v-model="form[key]" button-style="solid">
                <a-radio-button :value="1">男</a-radio-button>
                <a-radio-button :value="2">女</a-radio-button>
              </a-radio-group>
            </template>
            <template v-else-if="item.type == 'date'">
              <a-date-picker allowClear :value="form[key]"></a-date-picker>
            </template>
            <template v-else-if="item.type == 'select'">
              <a-select v-model="form[key]" :options="item.options"></a-select>
            </template>
            <template v-else-if="item.type == 'switch'">
              <a-switch v-model="form[key]"></a-switch>
            </template>
            <template v-else-if="item.type == 'file'">
              <g-upload v-model="form[key]" />
            </template>
            <template v-else-if="item.type == 'popup'">
              <g-popup
                v-model="form[key]"
                :columns="item.columns"
                :rawFields="item.rawFields"
                :keyMap="item.keyMap"
                :record="form"
                :conChar="item.conChar"
                url="/poros-permission/secStaff/list"
                :showIndex="item.showIndex"
                @callback="
                  (obj) => submit_callback(form, obj, item.callBackKeyArr)
                "
              >
                <template v-slot:default="{ loadData }">
                  <g-search @search="loadData"></g-search>
                </template>
              </g-popup>
            </template>
          </a-form-model-item>
        </a-col>
      </template>
    </a-row>
  </a-form-model>
</template>
<script>
import gUpload from './components/g-upload'
import gPopup from './components/g-popup'
import gSearch from './components/g-search'
import _ from 'lodash'
import Vue from 'vue'
import moment from 'moment'
export default {
  name: 'gForm',
  provide() {
    return {
      provObj: new Vue({
        data() {
          return {
            errorCheck: false,
            // 验证通过时canSubmitNum应该为0
            canSubmitNum: 0,
            checkVal: (num) => {
              this.canSubmitNum += num
            },
          }
        },
      }),
    }
  },
  data() {
    let customerCheck = (rule, value, callback) => {
      if (value) {
        callback()
      } else {
        callback(new Error('必填'))
      }
    }
    return {
      formKey: 'form1',
      form: {},
    }
  },
  components: {
    gUpload,
    gPopup,
    gSearch,
  },
  props: {
    rules: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Object,
      default: () => ({}),
    },
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
      default: () => ({ span: 4 }),
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
    this.initForm()
    console.log(this.form)
  },
  methods: {
    initForm() {
      let obj = {}
      for (var key in this.data) {
        if (this.data.hasOwnProperty(key)) {
          obj[key] =
            typeof this.data[key] == 'object'
              ? this.data[key].default
              : this.data[key]
        }
      }
      this.form = obj
    },
    submit_callback(record, obj, keys) {
      for (var i of keys) {
        record[i] = ''
      }
      obj.forEach((item, index) => {
        for (var i of keys) {
          record[i] =
            String(record[i]) +
            String(item[i]) +
            (obj.length - 1 == index ? '' : ',') // conChar
        }
      })
      console.log(_.pick(record, ['id', 'name', 'uid1']))
    },
    check() {
      console.log('form submit')
      return new Promise((resolve, reject) => {
        this.$refs[this.formKey].validate((valid) => {
          if (valid) {
            resolve(this.form)
          } else {
            console.log('error submit!!')
            reject('表单验证没通过')
            return false
          }
        })
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
      this.$refs[this.formKey].resetFields()
    },
    // 移除表单校验结果  如不传参则移除整个表单的校验结果
    clearValidate(array) {
      this.$refs[this.formKey].clearValidate(array)
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