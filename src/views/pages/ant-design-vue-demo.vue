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
      ></a-table>
    </div>
    <div class="footer" />
    <ant-design-vue-demo-dialog ref="antDesignVueDemoDialog" />
  </div>
</template>
<script>
import listMixin from './listMixin'
import antDesignVueDemoDialog from './ant-design-vue-demo-dialog'
export default {
  mixins: [listMixin],
  components: { antDesignVueDemoDialog },
  data() {
    return {
      size: 'middle',
      bordered: true,
      columns: [],
      dataSource: [],
    }
  },
  methods: {},
}
</script>
<style lang="less" scoped>
@import '../../style/common.less';
</style>