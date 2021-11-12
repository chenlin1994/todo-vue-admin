<template>
  <div>
    <div class="toolbars">
      <a-button type="primary" @click="openDialog('antDesignVueDemoDialog')"
        >新增</a-button
      >
    </div>
    <div class="table">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :size="size"
        :bordered="bordered"
        row-key="id"
      >
        <template slot="operator" slot-scope="t, r">
          <a-button
            type="primary"
            @click="openDialog('antDesignVueDemoDialog', r)"
            >编辑</a-button
          >
          <a-divider type="vertical" />
          <a-popconfirm title="是否删除" @confirm="() => del(r)">
            <a href="#"><a-button type="danger">删除</a-button></a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <div class="footer" />
    <ant-design-vue-demo-dialog ref="antDesignVueDemoDialog" @submit="(data)=>submit(data,'antDesignVueDemoDialog')" />
  </div>
</template>
<script>
import listMixin from './listMixin'
import antDesignVueDemoDialog from './ant-design-vue-demo-dialog'
import moment from 'moment'
export default {
  mixins: [listMixin],
  components: { antDesignVueDemoDialog },
  data() {
    return {
      size: 'middle',
      bordered: true,
      columns: [
        {
          title: '用户名',
          dataIndex: 'username',
          key: 'username',
        },
        {
          title: '密码',
          dataIndex: 'password',
          key: 'password',
        },
        {
          title: '创建日期',
          dataIndex: 'gmt_create',
          key: 'gmt_create',
          customRender(t) {
            return t ? moment(t).format('YYYY-MM-DD HH:mm:ss') : ''
          },
        },
        {
          title: '操作',
          dataIndex: 'operator',
          scopedSlots: { customRender: 'operator' },
        },
      ],
      url: {
        list: '/user/list',
        post: '/register',
        del: '/delete',
      },
    }
  },
  methods: {},
  created() {
    this.loadData()
  },
}
</script>
<style lang="less" scoped>
@import '../../style/common.less';
</style>