<template>
  <div :class="show ? 'g-check-error' : ''">
    <a-tooltip placement="top">
      <a-tree-select
        :value="value"
        style="width: 100%"
        :dropdown-style="dropdownStyle"
        :tree-data="treeData"
        :placeholder="placeholder"
        :load-data="onLoadData"
        :size="size"
        :allowClear="allowClear"
        tree-data-simple-mode
        :multiple="multiple"
        :treeCheckable="treeCheckable"
        :maxTagCount="maxTagCount"
        :showSearch="showSearch"
        :filterTreeNode="filterTreeNode"
        @change="change"
        @select="select"
      ></a-tree-select>
      <template slot="title" v-if="show">
        <span>{{ validate.message }}</span>
      </template>
    </a-tooltip>
  </div>
</template>
<script>
import mixin from './mixin'
export default {
  name:'gTreeSelect',
  mixins: [mixin],
  model: {
    prop: 'value',
    event: 'change',
  },
  methods: {
    initTreeData() {
      this.treeData = [
        { id: 1, pId: 0, value: '1', title: 'Expand to load' },
        { id: 2, pId: 0, value: '2', title: 'Expand to load' },
        { id: 3, pId: 0, value: '3', title: 'Tree Node', isLeaf: true },
      ]
    },
    change(value, label, extra) {
      this.$emit('change', value ? value : '')
    },
    select(value, node, extra) {
      this.$emit('change', value ? value : '')
    },
    getTreeNode(parentId, isLeaf = false) {
      const random = Math.random().toString(36).substring(2, 6)
      return {
        id: random,
        pId: parentId,
        value: random,
        title: isLeaf ? 'treeNode' : 'Expand to load',
        isLeaf,
      }
    },

    onLoadData(treeNode) {
      return new Promise((resolve) => {
        const { id } = treeNode.dataRef
        setTimeout(() => {
          this.treeData = this.treeData.concat([
            this.getTreeNode(id, false),
            this.getTreeNode(id, true),
          ])
          resolve()
        }, 300)
      })
    },
  },
  data() {
    return {
      treeData: [],
    }
  },
  created() {
    this.initTreeData()
  },
  props: {
    size: {
      type: String,
      default: 'large', // large | default | small
    },
    dropdownStyle: {
      type: Object,
      default: () => ({ maxHeight: '400px', overflow: 'auto' }),
    },
    treeCheckable: {
      type: Boolean,
      default: false,
    },
    validate: {
      type: Object,
      default: () => ({
        required: false,
        message: '',
      }),
    },
    value: {
      type: [Array, String],
      default: '',
    },
    maxTagCount: {
      type: Number,
      default: 3,
    },
    showSearch: {
      type: Boolean,
      default: false,
    },
    filterTreeNode: {
      type: Function,
      default: (inputValue, treeNode) => {
        let { id, pId, title, value } = treeNode.data.props
        if (title.indexOf(inputValue) != -1) {
          return true
        } else {
          return false
        }
      },
    },
  },
}
</script>
<style lang="less" scoped>
.g-check-error {
  /deep/ .ant-select-selection {
    border: 1px solid #ff4d4f;
    border-width: 1px !important;
    outline: 0;
    &:hover {
      box-shadow: 0 0 0 2px rgb(245 34 45 / 20%);
    }
  }
}
</style>