<template>
  <div>
    <a-table
      :dataSource="list"
      :columns="columns"
      row-key="id"
      :pagination="pagination"
      :bordered="bordered"
    >
      <template slot="customTitle">
        <span><a-icon type="smile-o"></a-icon>{{ '1234' }}</span>
      </template>
      <template slot="name" slot-scope="t, r, i">
        <a-tooltip placement="top">
          <template slot="title">
            <span>prompt text</span>
          </template>
          <span>{{ t }}_{{ i }}</span>
        </a-tooltip>
      </template>
    </a-table>
  </div>
</template>
<script>
// import Template1 from '../../../../example/templates/template1.vue'
/**
 * 在Table中 dataSource和columns里的数据值都需要绑定key值 对于dataSource默认将每列数据的key属性作为唯一的标识
 * 如果数据没有这个属性 务必使用rowKey来指定数据列的主键 若没有指定 控制台会出现缺少key的提示，表格组件也会出现各类奇怪的错误
 * <Table rowKey = "uid"></Table>
 * <Table rowKey = (record,index) => record.uid></Table>
 */

export default {
  name:'gTable',
  data() {
    return {
      pagination: {
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        total: 100,
        showTotal: (total) => `共${total}条`,
      },
      list: [
        {
          name: 11,
          id: 1,
        },
      ],
    }
  },
  props: {
    record: {
      type: Object,
      default: () => ({}),
    },
    bordered: {
      type: Boolean,
      default: true,
    },
    columns: {
      default: () => [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          customRender: (t, r, i) => {
            return i + 1
          },
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name', title: 'customTitle' },
        },
        {
          title: '年龄',
          dataIdnex: 'age',
          key: 'age',
        },
        {
          title: '性别',
          dataIndex: 'gender',
          key: 'gender',
        },
        {
          title: '时间',
          dataIndex: 'date',
          key: 'date',
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
        },
      ],
      type: Array,
    },
  },
  methods: {
    init() {
      console.log('table init......')
    },

    submit(callback) {
      console.log('table submit')
      callback()
    },
  },
}
</script>     
<style lang="less" scoped>
/deep/ .required-check {
  &::before {
    content: '*';
    display: inline-block;
    color: red;
    margin-right: 5px;
    vertical-align: middle;
  }
}
</style> 