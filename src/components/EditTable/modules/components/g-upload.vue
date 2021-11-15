<template>
  <div :class="show ? 'g-check-error' : ''">
    <a-tooltip placement="top">
      <a-upload
        :multiple="multiple"
        :header="tokenHeader"
        :action="uploadUrl"
        :data="data"
        :name="name"
        :fileList="fileList"
        @change="change"
      >
        <a-button> <a-icon type="upload" /> 上传 </a-button>
      </a-upload>
      <template slot="title" v-if="show">
        <span>{{ validate.message }}</span>
      </template>
    </a-tooltip>
  </div>
</template>
<script>
import Vue from 'vue'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
import mixin from './mixin'
export default {
  name:'gUpload',
  mixins: [mixin],
  created() {
    this.init()
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    name: {
      type: String,
      default: 'file',
    },
    data: {
      type: Object,
      default: () => ({ bucketName: 'poros', expireDate: 0 }),
    },
    uploadedFileList: {
      type: Array,
      default: () => [],
    },
    validate: {
      type: Object,
      default: () => ({
        required: false,
        message: '',
      }),
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      fileList: [
        {
          uid: '1',
          name: '文件1.xlsx',
          status: 'done',
          response: '{status:"success"}',
          url:
            'http://minio.poros-platform.192.168.51.10.nip.io/poros/1415971050770755586.xlsx',
        },
      ],
      tokenHeader: {
        // 'X-Access-Token': Vue.ls.get('ACCESS_TOKEN'),
      },
      uploadUrl: '/api/poros-oss/file/upload',
      downLoadUrl: '/api/poros-oss/file/download', // query {path:''}
      preview: 'http://fileview.jeecg.com/onlinePreview', // query {url: encodeURIComponent(url)}
    }
  },
  methods: {
    init() {
      this.fileList = this.uploadedFileList.map((item) => ({
        uid: item.url,
        name: item.name,
        status: 'done',
        response: '{status:"success"}',
        url: item.url,
      }))
    },
    returnFileList() {
      let fileList = this.fileList
        .filter((item) => item.status == 'done')
        .map((item) => ({ name: item.name, url: item.url }))
      this.$emit('change', fileList)
    },
    change(info) {
      // 文件删除
      if (info.file.status == 'removed') {
        this.fileList = this.fileList.filter(
          (item) => item.uid != info.file.uid
        )
        this.returnFileList()
        return
      }
      // 文件上传
      let uids = this.fileList.map((item) => item.uid)
      !uids.includes(info.file.uid) && this.fileList.push(info.file)
      if (info.file.status == 'done') {
        if (info.file.response.code == 0) {
          let obj = {
            uid: info.file.response.data,
            name: info.file.name,
            status: 'done',
            response: '{status:"success"}',
            url: info.file.response.data,
          }
          this.fileList = this.fileList.filter(
            (item) => item.uid != info.file.uid
          )
          this.$message.success('success')
          this.multiple ? this.fileList.push(obj) : (this.fileList = [obj])
          this.returnFileList()
        } else {
          this.$message.success(info.file.response.msg)
        }
      } else if (info.file.status == 'error') {
        this.$message.warning(`${info.file.name} file uplaod failed`)
        this.fileList = this.fileList.filter((item) => item.status != 'error')
      }
    },
  },
}
</script>
<style lang="less" scoped>
.g-check-error {
  /deep/ .ant-upload {
    border: 1px solid #ff4d4f;
    border-width: 1px !important;
    outline: 0;
    &:hover {
      box-shadow: 0 0 0 2px rgb(245 34 45 / 20%);
    }
  }
}
</style>