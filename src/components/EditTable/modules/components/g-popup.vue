<template>
  <div>
    <div :class="show ? 'g-check-error' : ''">
      <a-tooltip placement="top">
        <a-input
          v-if="inputType != 'button'"
          :value="value"
          @click="visible = true"
          @mouseenter.stop="showClose = true"
          @mouseleave.stop="showClose = false"
          @pressEnter="enter"
        >
          <a-icon
            slot="suffix"
            type="close-circle"
            v-show="showClose && value"
            @mouseenter="showClose = true"
            style="cursor: pointer"
            @click="clear"
          />
        </a-input>
        <a-input-search v-else :value="value" @search="visible = true">
          <span slot="enterButton"> 选择 </span>
          <a-icon
            slot="suffix"
            type="close-circle"
            v-show="showClose && value"
            @mouseenter="showClose = true"
            style="cursor: pointer"
            @click="clear"
          />
        </a-input-search>
        <template slot="title" v-if="show">
          <span>{{ validate.message }}</span>
        </template>
      </a-tooltip>
    </div>
    <a-modal
      v-drag
      :title="title"
      @ok="submit"
      @cancel="cancel"
      v-model="visible"
      :width="width"
    >
      <slot v-bind:ipagination="ipagination" :loadData="loadData"></slot>
      <a-table
        :bordered="bordered"
        :size="size"
        :row-key="rawFields[1]"
        :columns="columnsF"
        :dataSource="dataSource"
        :pagination="ipagination"
        :scroll="scroll"
        @change="change"
        :loading="loading"
        :rowSelection="{
          type: type,
          selectedRowKeys: selectedRowKeys,
          selectedRows: selectedRowsCurrentPage,
          onChange: onChange,
        }"
      ></a-table>
      <div class="selectd-list" v-if="showSelectedList">
        <div class="left">
          <span>已选择</span>
          <span>{{selectedRowKeys.length}}</span>
          /<span>{{ipagination.total}}</span>
        </div>
        <div class="right">
          <a-tag closable @close="()=>close(item,index)" v-for="(item,index) in selectedRows" :key="index">
            {{item[rawFields[0]]}}
        </a-tag>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { getList } from '../../api'
import mixin from './mixin'
import _ from 'lodash'
export default {
  name: 'gPopup',
  mixins: [mixin],
  watch: {
    visible(val) {
      if (val) {
        this.ipagination.current = 1
        this.searchQueryShim = {}
        this.$emit('rest')
        this.loadData()
        let isNumber =
          this.dataSource[0] &&
          typeof this.dataSource[0][this.rawFields[1]] === 'number'
        let recourceObj = {}
        for (let j in this.keyMap) {
          if (this.keyMap.hasOwnProperty(j)) {
            recourceObj[j] = this.record[this.keyMap[j]]
          }
        }
        if (!recourceObj[this.rawFields[1]]) {
          this.selectedRowKeys = []
          this.selectedRows = []
          return
        }
        this.selectedRowKeys = recourceObj[this.rawFields[1]]
          .split(',')
          .map((item) => (isNumber ? Number(item) : item))
        this.selectedRows = []
        for (var i = 0; i < this.selectedRowKeys.length; i++) {
          let obj = {}
          for (let j of this.rawFields) {
            obj[j] =
              j == this.rawFields[1]
                ? isNumber
                  ? Number(recourceObj[j].split(this.conChar)[i])
                  : recourceObj[j].split(this.conChar)[i]
                : recourceObj[j].split(this.conChar)[i]
          }
          this.selectedRows.push(obj)
        }
      }
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  data() {
    return {
      loading:false,
      showClose: false,
      visible: false,
      columnsF: [],
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      selectedRowsCurrentPage: [],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        fixed: 'right',
      },
      searchQueryShim:{}
    }
  },
  created() {
    this.initColumns()
  },
  methods: {
    close(item,index){
      this.selectedRowKeys.splice(index,1)
      this.selectedRows.splice(index,1)
    },
    enter(e) {
      if (!this.radio != 'radio') {
        return
      }
      getList(this.url, { keyword: e.target.value }).then((res) => {
        if (res) {
          let obj = res.records[0]
          obj && (this.onChange([obj[this.rawFields[1]]], [obj]), this.submit())
        }
      })
    },
    clear() {
      if (this.value) {
        this.$emit('change', '')
        this.$emit('callback', [])
      }
    },
    change(pagination, filters, sorter) {
      this.ipagination = pagination
      this.loadData()
    },
    onChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      if (this.type == 'radio') {
        this.selectedRows = selectedRows
        return
      }
      if (selectedRowKeys.length < this.selectedRows.length) {
        this.selectedRows = this.selectedRows.filter((item) =>
          this.selectedRowKeys.includes(item[this.rawFields[1]])
        )
      } else {
        this.selectedRows = this.selectedRows.concat(selectedRows)
        this.selectedRows = this.removeRepeat(
          this.selectedRows,
          this.rawFields[1]
        )
      }
    },
    removeRepeat(arr, field) {
      let s = {}
      for (let i = 0; i < arr.length; i++) {
        s[arr[i][field]] = arr[i]
      }
      return Object.values(s)
    },
    submit() {
      console.log(this.selectedRows)
      if (this.selectedRowKeys.length != 0) {
        this.$emit(
          'change',
          this.selectedRows
            .map((item) => item[this.rawFields[0]])
            .join(this.conChar)
        )
        this.$emit(
          'callback',
          this.selectedRows.map((item) =>
            this.transferByKeymap(_.pick(item, this.rawFields))
          )
        )
      }
      this.visible = false
    },
    cancel() {
      this.visible = false
    },
    transferByKeymap(obj) {
      if (JSON.stringify(this.keyMap) == '{}') {
        return obj
      }
      let returnObj = {}
      // let keys = Object.keys(this.keyMap)
      for (var i of this.rawFields) {
        returnObj[this.keyMap[i] || i] = obj[i]
      }
      return returnObj
    },
    removefields(obj) {
      for (let key in obj) {
        if (
          obj.hasOwnProperty(key) &&
          [undefined, null, ''].includes(obj[key])
        ) {
          delete obj[key]
        }
      }
      return obj
    },
    loadData(obj = {}) {
      this.loading = true
      if(obj.current) {
        this.ipagination.current = obj.current
      } else {
        this.searchQueryShim = obj
      }
      let params = {
        pageNo: this.ipagination.current,
        limit: this.ipagination.pageSize,
        ...this.searchQuery,
        ...this.searchQueryShim
      }
      getList(params[this.changeUrlField]?this.urlCopy:this.url, this.removefields(params),this.methods).then(
        (res) => {
          if(res) {
          this.dataSource = res.records,
          this.ipagination.total = res.total
          }
          this.loading = false
        }
      )
    },
    initColumns() {
      let obj = Object.keys(this.columns)
      this.showIndex &&
        this.columnsF.push({
          title: '序号',
          customRender: (t, r, i) => i + 1,
          width: 60,
          align: 'center',
          // scopedSlots:{customRender:'name'}
        })
      for (var i of obj) {
        if(typeof this.columns[i] == 'object'){
            this.columnsF.push({
            title: this.columns[i].title,
            customRender:this.columns[i].customRender,
            dataIndex: i,
            width: 150,
            align: 'center',
          })
        } else {
          this.columnsF.push({
            title: this.columns[i],
            dataIndex: i,
            width: 150,
            align: 'center',
          })
        }
      }
    },
  },
  props: {
    scroll: {
      type: Object,
      default: () => ({ y: 500,x:600 }),
    },
    value: {
      type: [String, Number],
      default: '',
    },
    /**
     * 存储需要展示的字段名和名称的集合
     * 字段均为获取数据的字段而非提交所要的字段
     * eg:{name：'姓名',code:'编码'}
     */
    columns: {
      type: Object,
      default: () => ({}),
    },
    /** 字段均为获取到的数据的字段而非需要提交的字段
     *  arr[0] 表示要在选择之后显示的字段
     *  arr[1] 表示selectedRowKeys保存的字段 一定是唯一的
     *  回调时需要组装的对象包含的字段
     *  eg:['name','id']
     */
    rawFields: {
      type: Array,
      default: () => ['name', 'id'],
    },
    /**
     * 获取字段与提交字段不一致时的映射表
     * rawFields映射到实际需要的字段
     * 回调函数拿到的参数就是需要的参数而不一定是弹框表格的参数
     * eg: {id:'id1',name:'realName'}
     */
    keyMap: {
      type: Object,
      default: () => ({}),
    },
    /**
     * 已经选中的集合
     */
    record: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: '请选择',
    },
    url: {
      type: String,
      default: '',
    },
    /**
     * 多数据时字段以改连接符进行拼接
     */
    conChar: {
      type: String,
      default: ',',
    },
    /**
     * 表格是否展示序号一列
     */
    showIndex: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'checkbox', //'radio',
    },
    width: {
      type: Number,
      default: 1000,
    },
    allowClear: {
      type: Boolean,
      default: true,
    },
    validate: {
      type: Object,
      default: () => ({
        required: false,
        message: '',
      }),
    },
    bordered: {
      type: Boolean,
      default: true,
    },
    inputType: {
      type: String,
      default: 'input',
    },
    searchQuery: {
      type: Object,
      default: () => ({}),
    },
    methods:{
      type:String,
      default:'get'
    },
    // 正常设计不会用到 查询含有某些条件切换接口
    urlCopy:{
      type:String,
      default:''
    },
    size:{
      type:String,
      default:'middle'
    },
    changeUrlField:{
      type:String,
      default:''
    },
    showSelectedList:{
      type:Boolean,
      default:false
    }
  },
}
</script>
<style lang="less" scoped>
.g-check-error {
  /deep/ .ant-input {
    border: 1px solid #ff4d4f;
    border-width: 1px !important;
    outline: 0;
    &:hover {
      box-shadow: 0 0 0 2px rgb(245 34 45 / 20%);
    }
  }
}
/deep/ .ant-input-groua-addon {
  .ant-btn {
    height: 32px;
  }
}
.selectd-list{
  width:100%;
  padding:0 10px;
  margin-top:20px;
  .left{
    width:100px;
    display: inline-block;
    vertical-align: top;
  }
  .right{
    width:calc(100% - 100px);
    display: inline-block;
    overflow: auto;
    white-space: nowrap;
    padding-bottom: 10
  }
}
</style>