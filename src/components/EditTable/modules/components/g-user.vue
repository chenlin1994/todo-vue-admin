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
        <a-input-search
          v-else
          :value="value"
          read-only
          @search="visible = true"
        >
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
      <div class="content-box">
        <div class="left-box">
          <a-directory-tree
            @select="onSelect"
            :tree-data="treeData"
            :load-data="onLoadData"
            :selectedKeys="checkedKeys"
            :expandAction="false"
          ></a-directory-tree>
        </div>
        <div class="right-box">
          <slot v-bind:ipagination="ipagination" :loadData="loadData"></slot>
          <a-table
            :bordered="bordered"
            :row-key="rawFields[1]"
            :columns="columnsF"
            :dataSource="dataSource"
            :pagination="ipagination"
            :scroll="scroll"
            @change="change"
            :rowSelection="{
              type: type,
              selectedRowKeys: selectedRowKeys,
              selectedRows: selectedRowsCurrentPage,
              onChange: onChange,
            }"
          ></a-table>
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
  name: 'gUser',
  mixins: [mixin],
  watch: {
    visible(val) {
      if (val) {
        this.ipagination.current = 1
        this.loadData()
        this.getOrgList().then((res) => {
          res && (this.treeData = res)
        })
        this.checkedKeys = []
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
      checkedKeys: [],
      treeData: [],
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
    }
  },
  created() {
    this.initColumns()
    this.getOrgList().then((res) => {
      res && (this.treeData = res)
    })
  },
  methods: {
    onLoadData(treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        this.getOrgList({ code: treeNode.dataRef.key }).then((res) => {
          res &&
            ((treeNode.dataRef.children = res),
            (this.treeData = [...this.treeData]))
          resolve()
        })
      })
    },
    onSelect(checkedKeys, event) {
      if (this.checkedKeys[0] == checkedKeys) {
        this.checkedKeys = []
        this.loadData()
      } else {
        this.checkedKeys = checkedKeys
        this.ipagination.current = 1
        this.loadData({ orgCode: this.checkedKeys[0] })
      }
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
    loadData(obj) {
      let params = {
        pageNo: this.ipagination.current,
        limit: this.ipagination.pageSize,
        ...obj,
      }
      getList(this.url, this.removefields(params)).then(
        (res) =>
          res &&
          ((this.dataSource = res.records),
          (this.ipagination.total = res.total))
      )
    },
    getOrgList(obj = {}) {
      return getList('/poros-permission/secOrg/list', obj).then((res) => {
        if (res) {
          return res.map((item) => ({
            key: item.code,
            title: item.name,
            isLeaf: item.leaf,
          }))
        } else {
          return res
        }
      })
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
        this.columnsF.push({
          title: this.columns[i],
          dataIndex: i,
          width: 120,
          align: 'center',
        })
      }
    },
  },
  props: {
    scroll: {
      type: Object,
      default: () => ({ y: 500 }),
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
      default: '/poros-permission/secStaff/list',
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
      default: 'button',
    },
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
.content-box {
  display: flex;
  .left-box {
    flex: 0 1 320px;
    background: #ddd;
    overflow: auto;
    max-height: 600px;
  }
  .right-box {
    flex: 1;
    padding-left: 20px;
  }
}
</style>