import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'view-design'
import Valid from './utils/valid'
import {
  Row,
  Col,
  Form,
  Tooltip,
  Checkbox,
  DatePicker,
  Divider,
  Input,
  Modal,
  Radio,
  Select,
  Switch,
  Table,
  Transfer,
  TreeSelect,
  Tree,
  Upload,
  Button,
  Pagination,
  Message,
  FormModel,
  Icon
} from 'ant-design-vue'
import '@/styles/base.scss'
import 'view-design/dist/styles/iview.css'
import EditTable from '@/components/EditTable'
Vue.use(ViewUI)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Form.name, Form)
Vue.component(Checkbox.name, Checkbox)
Vue.component(DatePicker.name, DatePicker)
Vue.component(Divider.name, Divider)
Vue.component(Input.name, Input)
Vue.component(Modal.name, Modal)
Vue.component(Radio.name, Radio)
Vue.component(Select.name, Select)
Vue.component(Switch.name, Switch)
Vue.component(Table.name, Table)
Vue.component(Transfer.name, Transfer)
Vue.component(TreeSelect.name, TreeSelect)
Vue.component(Tree.name, Tree)
Vue.component(Upload.name, Upload)
Vue.component(Button.name, Button)
Vue.component(Pagination.name, Pagination)
Vue.component(Tooltip.name, Tooltip)
Vue.component(FormModel.name,FormModel)
Vue.component(Icon.name,Icon)
Vue.use(EditTable)
Vue.prototype.$Valid = Valid
Vue.prototype.$message = Message
Vue.config.productionTip = false
// 实现全局路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (to.meta.requireAuth) {
    if (store.state.userInfo.data.token) {
      if (to.path == '/login') {
        next('/')
      } else {
        next()
      }
    } else {
      next('/login')
    }
  } else {
    if (store.state.userInfo.data.token) {
      next('/')
    } else {
      next()
    }
  }
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
