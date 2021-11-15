<template>
  <div>
    <div :class="show ? 'g-check-error' : ''">
      <a-tooltip placement="top">
        <a-input
          :value="showValue"
          @click="visible = true"
          :allowClear="false"
          @change="inputChange"
        >
        </a-input>
        <template slot="title" v-if="show">
          <span>{{ validate.message }}</span>
        </template>
      </a-tooltip>
    </div>
    <a-modal
      title="穿梭框"
      :visible="visible"
      @ok="submit"
      @cancel="visible = false"
    >
      <a-transfer
        :rowKey="(record) => record.key"
        :data-source="dataSource"
        :show-search="showSearch"
        :titles="titles"
        :operations="operations"
        :target-keys="targetKeys"
        :render="render"
        :selectedKeys="selectedKeys"
        @change="change"
        :filterOption="filterOption"
        @selectChange="selectChange"
      >
        <template
          slot="children"
          slot-scope="{
            props: { direction, selectedKeys },
            on: { itemSelect },
          }"
        >
          <a-tree
            v-if="direction === 'left' && type === 'tree'"
            blockNode
            checkable
            checkStrictly
            defaultExpandAll
            :checkedKeys="[...selectedKeys, ...targetKeys]"
            :treeData="treeData"
            @check="
              (_, props) => {
                onChecked(
                  _,
                  props,
                  [...selectedKeys, ...targetKeys],
                  itemSelect
                )
              }
            "
            @select="
              (_, props) => {
                onChecked(
                  _,
                  props,
                  [...selectedKeys, ...targetKeys],
                  itemSelect
                )
              }
            "
          ></a-tree>
        </template>
      </a-transfer>
    </a-modal>
  </div>
</template>
<script>
import mixin from './mixin'
export default {
  name:'gTransfer',
  mixins: [mixin],
  model: {
    prop: 'value',
    event: 'change',
  },
  data() {
    return {
      visible: false,
      targetKeys: [],
      selectedKeys: [],
      showValue: '',
    }
  },
  watch: {
    value: {
      handler(val) {
        this.targetKeys = this.value ? this.value.split(this.conChar) : []
        this.initShow()
      },
      immediate: true,
    },
    visible(val) {
      val && (this.selectedKeys = [])
    },
  },
  methods: {
    inputChange(e) {
      if (e.target.value == '') {
        this.$emit('change', '')
        this.targetKeys = []
      }
    },
    initShow() {
      this.showValue = ''
      this.dataSource.forEach((item) => {
        if (this.targetKeys.includes(item.key)) {
          this.showValue = this.showValue + item.title + this.conChar
        }
      })
      this.showValue = this.showValue.substring(
        0,
        this.showValue.length - this.conChar.length
      )
    },
    render(record) {
      return record.title + ' ' + record.description
    },
    submit() {
      this.$emit('change', this.targetKeys.join(this.conChar))
      this.visible = false
    },
    filterOption(inputValue, option) {
      let { id, title, description } = option
      if (
        title.indexOf(inputValue) != -1 ||
        id.indexOf(inputValue) != -1 ||
        description.indexOf(inputValue) != -1
      ) {
        return true
      }
      return false
    },
    change(targetKeys, direction, moveKeys) {
      this.targetKeys = targetKeys
    },
    selectChange(sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]
    },
  },
  props: {
    dataSource: {
      type: Array,
      default: () => [
        { key: '1', title: '第一条', description: '11', chosen: false },
        { key: '2', title: '第二条', description: '11', chosen: false },
        { key: '3', title: '第三条', description: '11', chosen: false },
        { key: '4', title: '第四条', description: '11', chosen: false },
      ],
    },
    titles: {
      type: Array,
      default: () => ['source', 'target'],
    },
    operations: {
      type: Array,
      default: () => ['to right', 'to left'],
    },
    showSearch: {
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
    type: {
      type: String,
      default: 'normal',
    },
    value: {
      type: [String, Number, Array],
      default: '',
    },
    showSelectAll: {
      type: Boolean,
      default: true,
    },
    conChar: {
      type: String,
      default: ',',
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
/deep/ .ant-select {
  width: 100%;
}
</style>