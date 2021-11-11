<template>
  <div>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      bordered
      size="middle"
    ></a-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      columns: [
        {
          title: '第一列',
          dataIndex: '1',
          align: 'center',
        },
        {
          title: '第二列',
          dataIndex: '2',
          align: 'center',
        },
        {
          title: '第三列',
          dataIndex: '3',
          align: 'center',
        },
        {
          title: '第四列',
          dataIndex: '4',
          align: 'center',
        },
      ],
      dataSource: [],
    }
  },
}
</script>