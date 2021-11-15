<template>
  <div>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      ref="pTable"
      :row-key="(r, i) => r.id || i"
      size="small"
      :scroll="scroll"
      :pagination="pagination"
      :loading="loading"
      bordered
    >
      <template slot="input" slot-scope="t, r, i, c">
        <g-input
          v-model="r[c.dataIndex]"
          :validate="c.validate ? c.validate[0] : {}"
          :enterCallback="
            c.enterCallback ? c.enterCallback(t, r, i) : enterCallbackDefault
          "
          :index="i"
        ></g-input>
      </template>
      <template slot="number" slot-scope="t, r, i, c">
        <g-input
          type="number"
          v-model="r[c.dataIndex]"
          :validate="c.validate ? c.validate[0] : {}"
          :index="i"
        ></g-input>
      </template>
      <template slot="textarea" slot-scope="t, r, i, c">
        <g-input
          type="textarea"
          v-model="r[c.dataIndex]"
          :validate="c.validate ? c.validate[0] : {}"
          :enterCallback="
            c.enterCallback ? c.enterCallback(t, r, i) : enterCallbackDefault
          "
          :index="i"
        ></g-input>
      </template>
      <template slot="radio" slot-scope="t, r, i, c">
        <g-radio
          v-model="r[c.dataIndex]"
          :validate="c.validate ? c.validate[0] : {}"
          :index="i"
        ></g-radio>
      </template>
      <template slot="select" slot-scope="t, r, i, c">
        <g-select
          v-model="r[c.dataIndex]"
          :validate="c.validate ? c.validate[0] : {}"
          :mode="c.mode"
          @callback="(obj) => c.callback(obj, r)"
          :index="i"
          :options="c.options"
        ></g-select>
      </template>
      <template slot="switch" slot-scope="t, r, i, c">
        <g-switch v-model="r[c.dataIndex]" :index="i"></g-switch>
      </template>
      <template slot="span" slot-scope="t, r, i, c">
        <g-span v-model="r[c.dataIndex]" :index="i"></g-span>
      </template>
      <template slot="checkbox" slot-scope="t, r, i, c">
        <g-checkbox
          v-model="r[c.dataIndex]"
          :validate="c.validate ? c.validate[0] : {}"
          :index="i"
        ></g-checkbox>
      </template>
      <template slot="date" slot-scope="t, r, i, c">
        <g-date
          v-model="r[c.dataIndex]"
          :validate="c.validate ? c.validate[0] : {}"
          :type="c.type"
          :format="c.format"
          :valueFormat="c.valueFormat"
          :index="i"
        ></g-date>
      </template>
      <template slot="upload" slot-scope="t, r, i, c">
        <g-upload
          v-model="r[c.dataIndex]"
          :validate="c.validate ? c.validate[0] : {}"
          :multiple="c.multiple"
          :uploadedFileList="t"
          :index="i"
        ></g-upload>
      </template>
      <template slot="transfer" slot-scope="t, r, i, c">
        <g-transfer
          v-model="r[c.dataIndex]"
          :validate="c.validate ? c.validate[0] : {}"
          :index="i"
        ></g-transfer>
      </template>
      <template slot="popover" slot-scope="t, r, i, c">
        <g-popover
          v-model="r[c.dataIndex]"
          :validate="c.validate ? c.validate[0] : {}"
          :columns="c.columns"
          :rawFields="c.rawFields"
          :keyMap="c.keyMap"
          :url="c.url"
          :showIndex="c.showIndex"
          :conChar="c.conChar"
          :type="c.type"
          :record="r"
          @callback="(obj) => submit_callback(r, obj, c)"
          :index="i"
        >
          <template v-slot:default="{ loadData }">
            <slot :name="c.dataIndex" :loadData="loadData"></slot>
          </template>
          <!-- <template v-slot:default="{ loadData }">
            <g-search @search="loadData"></g-search>
          </template> -->
        </g-popover>
      </template>
      <template slot="popup" slot-scope="t, r, i, c">
        <g-popup
          v-model="r[c.dataIndex]"
          :validate="c.validate ? c.validate[0] : {}"
          :columns="c.columns"
          :rawFields="c.rawFields"
          :keyMap="c.keyMap"
          :url="c.url"
          :showIndex="c.showIndex"
          :conChar="c.conChar"
          :type="c.type"
          :record="r"
          @callback="(obj) => submit_callback(r, obj, c)"
          :index="i"
        >
          <template v-slot:default="{ loadData }">
            <slot :name="c.dataIndex" :loadData="loadData"></slot>
            <!-- <g-search @search="loadData"></g-search> -->
          </template>
        </g-popup>
      </template>
      <template slot="treeSelect" slot-scope="t, r, i, c">
        <g-tree-select
          v-model="r[c.dataIndex]"
          :validate="c.validate ? c.validate[0] : {}"
          :multiple="c.multiple"
          :treeCheckable="c.treeCheckable"
          :showSearch="c.showSearch"
          :filterTreeNode="c.filterTreeNode"
          :index="i"
        ></g-tree-select>
      </template>
      <template slot="operator" slot-scope="t, r, i">
        <slot
          name="operator"
          :table_record="r"
          :table_index="i"
          :table_text="t"
          :pagination="pagination"
        ></slot>
      </template>
      <template slot="customer" slot-scope="t, r, i, c">
        <slot
          :name="c.dataIndex"
          :table_record="r"
          :table_index="i"
          :table_text="t"
          :table_column="c"
        ></slot>
      </template>
      <template slot="customerTitle">
        <slot name="customerTitle"></slot>
      </template>
    </a-table>
  </div>
</template>
<script>
import Vue from 'vue'
import gSearch from './components/g-search'
import gInput from './components/g-input'
import gPopup from './components/g-popup'
import gRadio from './components/g-radio'
import gSelect from './components/g-select'
import gSwitch from './components/g-switch'
import gCheckbox from './components/g-checkbox.vue'
import gDate from './components/g-date'
import gUpload from './components/g-upload'
import gTreeSelect from './components/g-tree-select'
import gTransfer from './components/g-transfer'
import gSpan from './components/g-span'
import gPopover from './components/g-popover'
export default {
  name: 'gEditTable',
  provide() {
    return {
      provObj: new Vue({
        data() {
          return {
            errorCheck: false,
            // 验证通过时canSubmitNum应该为0
            canSubmitNum: 0,
            index: null,
            checkVal: (num) => {
              this.canSubmitNum += num
            },
          }
        },
      }),
    }
  },
  components: {
    gSearch,
    gInput,
    gPopup,
    gRadio,
    gSelect,
    gSwitch,
    gDate,
    gCheckbox,
    gUpload,
    gTreeSelect,
    gTransfer,
    gSpan,
    gPopover,
  },
  data() {
    return {
      columns: [],
    }
  },
  watch: {
    dataSource: {
      handler() {
        this.initColunsHeightTrigger()
      },
    },
  },
  methods: {
    initColunsHeightTrigger() {
      this.$nextTick(() => {
        this.initColunsHeight()
      })
    },
    initColunsHeight() {
      const scrollDiv = this.$refs.pTable.$el.querySelector(
        '.ant-table-scroll .ant-table-body'
      )
      const leftFixedDiv = this.$refs.pTable.$el.querySelector(
        '.ant-table-fixed-left .ant-table-body-inner'
      )
      const rightFixedDiv = this.$refs.pTable.$el.querySelector(
        '.ant-table-fixed-right .ant-table-body-inner'
      )
      const scrollBox = this.$refs.pTable.$el.querySelector(
        '.ant-table-scroll'
      )
      const rightDiv = this.$refs.pTable.$el.querySelector(
        '.ant-table-fixed-right'
      )
      const leftDiv = this.$refs.pTable.$el.querySelector(
        '.ant-table-fixed-left'
      )
      let arrs = scrollDiv.querySelectorAll('.ant-table-row')
      let objarr = []
      rightDiv &&
        (rightDiv.querySelector(
          '.ant-table-thead'
        ).style.height = getComputedStyle(
          scrollBox.querySelector('.ant-table-thead')
        ).height)
      leftDiv &&
        (leftDiv.querySelector(
          '.ant-table-thead'
        ).style.height = getComputedStyle(
          scrollBox.querySelector('.ant-table-thead')
        ).height)
      arrs.forEach((item) => {
        let rowKey = item.getAttribute('data-row-key')
        let height = getComputedStyle(item).height
        objarr.push({
          id: item.getAttribute('data-row-key'),
          height: getComputedStyle(item).height,
        })
        leftFixedDiv &&
          (leftFixedDiv.querySelector(
            `tr[data-row-key='${rowKey}']`
          ).style.height = height)
        rightFixedDiv &&
          (rightFixedDiv.querySelector(
            `tr[data-row-key='${rowKey}']`
          ).style.height = height)
      })
    },
    enterCallbackDefault() {
      console.log('请自定义函数传入')
    },
    required(columns) {
      return {
        class: { 'g-required-check': true },
      }
    },
    submit_callback(record, obj, column) {
      if (column.callback) {
        column.callback(record, obj)
      } else {
        let keys = column.callBackKeyArr

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
        console.log(_.pick(record, keys))
      }
    },
    check(formData = {}, index = null) {
      this._provided.provObj.errorCheck = true
      ![undefined, null].includes(index) &&
        (this._provided.provObj.index = index)
      return new Promise((resolve, reject) => {
        if (this._provided.provObj.canSubmitNum == 0) {
          resolve({ ...formData, dataSource: this.dataSource })
        } else {
          // 如果不是全表格判断则判断逻辑放在上层去做
          if (this._provided.provObj.index !== null) {
            resolve({ ...formData, dataSource: this.dataSource })
          } else {
            reject('表格验证没通过')
          }
        }
      })
      setTimeout(() => {
        console.log(
          'canSubmit',
          this._provided.provObj.canSubmitNum == 0 ? true : false
        )
        console.log('errorCheck', this._provided.provObj.errorCheck)
        console.log(`有${this._provided.provObj.canSubmitNum}项没通过验证`)
        console.log(this.dataSource)
      }, 100)
    },
  },

  created() {
    this.columns = _.cloneDeep(this.originColumns).map((item) => {
      if (item.required) {
        return {
          width: 200,
          ...item,
          customHeaderCell: this.required,
          align: 'center',
        }
      } else {
        return { width: 200, ...item, align: 'center' }
      }
    })
    this.initColunsHeightTrigger()
  },
  props: {
    originColumns: {
      type: Array,
      default: () => [],
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    dataTempl: {
      type: Object,
      default: () => ({}),
    },
    scroll: {
      type: Object,
      default: () => ({ x: 500, y: 400 }),
    },
    pagination: {
      type: [Object, Boolean],
      default: false,
    },
    rowKey: {
      type: [String, Number],
      default: '',
    },
    loading:{
      type:Boolean,
      default:false
    }
  },
}
</script>
<style lang="less" scoped>
/deep/ .g-required-check {
  &::before {
    content: '*';
    display: inline-block;
    color: red;
    margin-right: 5px;
    vertical-align: middle;
  }
}
</style>