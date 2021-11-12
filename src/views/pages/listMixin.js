import { postAction, getAction, putAction, deleteAction } from '@/utils/network'
export default {
  data() {
    return {
      dataSource: [],
    }
  },
  methods: {
    openDialog(ref, data = {}) {
      this.$refs[ref].init(data)
    },
    loadData() {
      getAction(this.url.list).then((res) => {
        if (res.code == 0) {
          this.dataSource = res.data.rows
        }
      })
    },
    submit(data, ref) {
      postAction(this.url.post, data).then((res) => {
        if (res.code == 0) {
          this.$message.success('新增成功')
          this.loadData()
          this.$refs[ref].visible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    del(r) {
      deleteAction(`${this.url.del}/${r.id}`).then((res) => {
        if (res.code == 0) {
          this.$message.success('删除成功')
          this.loadData()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
  },
}
