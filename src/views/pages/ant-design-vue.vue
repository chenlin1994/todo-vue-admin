<template>
  <div>
    <div class="toolbar">
      <a-button type="primary" @click="addNew">新增</a-button>
    </div>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      bordered
      size="middle"
    ></a-table>
    <g-modal
      ref="modal"
      @submit="submit"
      :title="title"
      :customerFooter="footer"
      :confirmLoading="confirmLoading"
    >
      <g-form
        ref="form"
        :data="form"
        :rules="rules"
        :formKey="formKey1"
      ></g-form>
      <g-edit-table
        ref="editTable"
        :originColumns="originColumns"
        :dataSource="originDataSource"
        :dataTempl="dataTempl"
        :add="add"
        :del="del"
      >
        <template v-slot:operator="{ table_record, table_index, table_text }">
          <a-button
            type="primary"
            v-if="table_index == 0"
            @click="add(table_record, table_index, table_text)"
            >新增</a-button
          >
          <a-button
            type="danger"
            v-else
            @click="del(table_index, table_record, table_text)"
            >刪除</a-button
          >
        </template>
      </g-edit-table>
    </g-modal>
  </div>
</template>
<script>
export default {
  name: 'DemoCode',
  data() {
    return {
      originColumns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          customRender: (t, r, i) => {
            return i + 1
          },
          width: 60,
        },
        {
          title: 'input',
          dataIndex: 'name1',
          key: 'name1',
          scopedSlots: { customRender: 'input', title: 'customTitle' },
          required: true,
          validate: [{ required: true, message: '不能为空' }],
          enterCallback: (t, r, i) => {
            return (e) => {
              console.log(e.target.value)
              console.log(t, r, i)
            }
          },
          // customRender:(...reset)=>{
          //   console.log(reset)
          // }
        },
        {
          title: 'transfer',
          dataIndex: 'transfer',
          key: 'transfer',
          scopedSlots: { customRender: 'transfer' },
          required: true,
          validate: [{ required: true, message: '不能为空' }],
        },
        {
          title: 'tree-select',
          dataIndex: 'tree',
          key: 'tree',
          scopedSlots: { customRender: 'treeSelect' },
          required: true,
          validate: [{ required: true, message: '必填' }],
          // treeCheckable设置为true时 multiple默认为true设置也无效
          multiple: false,
          treeCheckable: false,
          // 只有单选模式下设置该参数才有效  多选模式无需这默认为true
          showSearch: true,
        },
        {
          title: 'multile-tree-select',
          dataIndex: 'treeMul',
          key: 'treeMul',
          scopedSlots: { customRender: 'treeSelect' },
          required: true,
          validate: [{ required: true, message: '文件必传' }],
          treeCheckable: true,
          multiple: true,
          showSearch: true,
          filterTreeNode: (inputValue, treeNode) => {
            let { id, pId, title, value } = treeNode.data.props
            if (title.indexOf(inputValue) != -1) {
              return true
            } else {
              return false
            }
          },
        },
        {
          title: 'textarea',
          dataIndex: 'address',
          key: 'address',
          scopedSlots: { customRender: 'textarea' },
          required: true,
          validate: [{ required: true, message: '地址不能为空' }],
        },
        {
          title: 'input-number',
          dataIndex: 'age',
          key: 'age',
          scopedSlots: { customRender: 'number' },
          required: true,
          validate: [{ required: true, message: '年龄要大于0' }],
        },
        {
          title: 'radio',
          dataIndex: 'gender',
          key: 'gender',
          scopedSlots: { customRender: 'radio' },
          required: true,
          validate: [{ required: true, message: '性别必选' }],
        },
        {
          title: 'multiple-select',
          dataIndex: 'interest',
          key: 'interest',
          scopedSlots: { customRender: 'select' },
          mode: 'multiple',
          required: true,
          validate: [{ required: true, message: '兴趣必选' }],
        },
        {
          title: 'select',
          dataIndex: 'interest1',
          key: 'interest1',
          scopedSlots: { customRender: 'select' },
          required: true,
          validate: [{ required: true, message: '兴趣1必选' }],
        },
        {
          title: 'switch',
          dataIndex: 'swtich',
          key: 'switch',
          scopedSlots: { customRender: 'switch' },
        },
        {
          title: 'checkbox',
          dataIndex: 'checkbox',
          key: 'checkbox',
          scopedSlots: { customRender: 'checkbox' },
          required: true,
          validate: [{ required: true, message: '复选框必选' }],
        },
        {
          title: 'date',
          dataIndex: 'date',
          key: 'date',
          scopedSlots: { customRender: 'date' },
          type: 'date',
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD',
          required: true,
          validate: [{ required: true, message: '日期必选' }],
        },
        {
          title: 'data-time',
          dataIndex: 'dateTime',
          key: 'dateTime',
          scopedSlots: { customRender: 'date' },
          type: 'dateTime',
          format: 'YYYY-MM-DD HH:mm:ss',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
          width: 300,
          required: true,
          validate: [{ required: true, message: '日期必选' }],
        },
        {
          title: 'date-range',
          dataIndex: 'dateRange',
          key: 'dateRange',
          scopedSlots: { customRender: 'date' },
          type: 'dateRange',
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD',
          required: true,
          validate: [{ required: true, message: '日期必选' }],
        },
        {
          title: 'data-time-range',
          dataIndex: 'dateTimeRange',
          key: 'dateTimeRange',
          scopedSlots: { customRender: 'date' },
          type: 'dateTimeRange',
          format: 'YYYY-MM-DD HH:mm:ss',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
          width: 400,
          required: true,
          validate: [{ required: true, message: '日期必选' }],
        },
        {
          title: 'multiple-file',
          dataIndex: 'file',
          key: 'file',
          scopedSlots: { customRender: 'upload' },
          multiple: true,
          required: true,
          validate: [{ required: true, message: '文件必传' }],
        },
        {
          title: 'file',
          dataIndex: 'filealone',
          key: 'filealone',
          scopedSlots: { customRender: 'upload' },
          multiple: false,
          required: true,
          validate: [{ required: true, message: '文件必传' }],
        },

        {
          title: 'popup',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'popup' },
          columns: { name: '姓名', uid: '账号', email: '邮箱' },
          rawFields: ['name', 'id', 'uid'],
          keyMap: { name: 'name', id: 'id1', uid: 'uid1' },
          conChar: ',',
          url: '/gc/poros-permission/secStaff/list',
          showIndex: true,
          type: 'checkbox',
          callBackKeyArr: ['uid1', 'id1'],
          required: true,
          validate: [{ required: true, message: '必填' }],
        },
        {
          title: '操作',
          dataIndex: 'operator',
          key: 'operator',
          scopedSlots: { customRender: 'operator' },
        },
      ],
      originDataSource: [
        {
          id: 1,
          name1: '',
          name: '',
          id1: '',
          uid1: '',
          age: 1,
          address: '',
          gender: 1,
          interest: [1],
          interest1: '',
          switch: '',
          checkbox: [],
          date: '',
          dateRange: [],
          dateTime: '',
          dateTimeRange: [],
          file: [],
          filealone: [],
          tree: '',
          treeMul: [],
          transfer: '',
        },
        {
          id: 2,
          name1: 222,
          name: 'wltest02,wltest03',
          id1: '448850,448851',
          uid1: 'wltest02,wltest03',
          age: 2,
          address: '武汉',
          gender: 0,
          interest: [],
          interest1: '',
          switch: '',
          checkbox: [],
          date: '',
          dateRange: [],
          dateTime: '',
          dateTimeRange: [],
          file: [],
          filealone: [],
          tree: '',
          treeMul: [],
          transfer: '1',
        },
      ],
      dataTempl: {
        name1: '',
        name: '',
        id1: '',
        uid1: '',
        age: 1,
        address: '',
        gender: 1,
        interest: [],
        interest1: '',
        switch: '',
        checkbox: [],
        date: '',
        dateRange: [],
        dateTime: '',
        dateTimeRange: [],
        file: [],
        filealone: [],
        tree: '',
        treeMul: [],
        transfer: '',
      },
      formKey1: 'formDom',
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        // file: [{ required: true, message: '请上传文件', trigger: 'change' }],
      },
      form: {
        name1: { type: 'input', default: 'input' },
        name: { type: 'input', default: 'input', labelCol: { span: 6 } },
        age: { default: 1, type: 'number' },
        address: { default: '', type: 'textarea' },
        gender: { default: 1, type: 'radio', labelCol: { span: 6 } },
        date: { default: '', type: 'date' },
        file: { default: [], type: 'file' },
        switch: { default: true, type: 'switch' },
        select: {
          default: '',
          type: 'select',
          options: [
            {
              label: '选项一',
              value: 1,
            },
            {
              label: '选项二',
              value: 2,
            },
          ],
        },
        popup: {
          default: '',
          type: 'popup',
          columns: { name: '姓名', uid: '账号', email: '邮箱' },
          keyMap: { name: 'name', id: 'id', uid: 'uid1' },
          rawFields: ['name', 'id', 'uid'],
          conChar: ',',
          callBackKeyArr: ['uid1', 'id'],
          showIndex: true,
        },
        id: '',
        uid1: '',
      },
      columns: [],
      title: '新增',
      footer: (
        <span>
          <a-button key="back" onClick={this.cancel}>
            取消
          </a-button>
          <a-button key="reset" onClick={this.reset}>
            还原
          </a-button>
          <a-button key="submit" type="primary" onClick={this.submit}>
            确认
          </a-button>
        </span>
      ),
      confirmLoading: false,
      defualtSuperQueryParams: [
        {
          field: 'billStatus',
          rule: 'ne',
          val: '5',
        },
      ],
      dataSource: [],
      roleReturn: false,
      isSupplier: false,
      billNo: '',
      title: '', //存表名
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      columns: [
        {
          title: '单据单号',
          align: 'center',
          dataIndex: 'billNo',
          scopedSlots: { customRender: 'billNo' },
          width: 120,
        },
        {
          title: '送修日期',
          align: 'center',
          dataIndex: 'sendRepairDate',
          customRender: function (text) {
            return timestampToDatetime(text)
          },
          width: 100,
        },
        {
          title: '返修类型',
          align: 'center',
          dataIndex: 'backRepairType',
          customRender: (text) =>
            [
              '',
              '在线单盘返修',
              '科研单盘返修',
              '工程单盘返修',
              '工序组件返修',
            ][text],
          width: 100,
        },
        {
          title: '来源单号',
          align: 'center',
          dataIndex: 'resourceBillno',
          width: 200,
        },
        {
          title: '供应商编码',
          align: 'center',
          dataIndex: 'supplierCode',
          width: 100,
        },
        {
          title: '供应商名称',
          align: 'center',
          dataIndex: 'supplierName',
          width: 100,
        },
        {
          title: 'SN/PN',
          align: 'center',
          dataIndex: 'snPn',
          width: 100,
        },
        {
          title: '返修物料编码',
          align: 'center',
          dataIndex: 'repairMcode',
          width: 100,
        },
        {
          title: '返修物料名称',
          align: 'center',
          dataIndex: 'repairMname',
          width: 100,
        },
        {
          title: '返修次数',
          align: 'center',
          dataIndex: 'repairNumber',
          width: 100,
        },
      ],
      url: {
        list: '/mes-manufacture/mfSingleDiskTask/list',
        delete: '/mes-manufacture/mfOnlineRepairTask/cancle',
        deleteBatch: '/mes-manufacture/mfOnlineRepairTask/cancle',
        exportXlsUrl: '/mes-code/mesBcTemplate/export',
        getColumns: '/mes-code/online/cgform/api/getColumns/',
        buttonAction: '/mes-code/online/cgform/api/doButton',
      },
      dictOptions: {},
      billStatus: '',
    }
  },
  methods: {
    addNew(type) {
      if (type == 'add') {
        this.title = '新增'
      } else {
        this.title = '编辑'
      }
      this.$refs['modal'].show()
      this.$nextTick(() => {
        this.$refs['form'].initForm()
        // this.originDataSource = [
        //   ...this.originDataSource,
        //   ...this.originDataSource,
        // ]
      })
    },
    add() {
      console.log('占位')
    },
    submit() {
      console.log('占位')
    },
    del() {
      console.log('占位')
    },
  },
}
</script>