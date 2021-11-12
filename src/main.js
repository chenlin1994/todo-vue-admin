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
  InputNumber,
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
  FormModelItem,
  Icon,
  Popconfirm
} from 'ant-design-vue'
import '@/styles/base.scss'
import 'view-design/dist/styles/iview.css'
import EditTable from '@/components/EditTable'
Vue.use(ViewUI)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Form.name, Form)
Vue.use(Checkbox)
Vue.use(DatePicker)
Vue.component(Divider.name, Divider)
Vue.component(Input.name, Input)
Vue.component(InputNumber.name, InputNumber)
Vue.component(Modal.name, Modal)
Vue.use(Radio)
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
Vue.component(Icon.name, Icon)
Vue.use(FormModel)
Vue.use(Popconfirm)
Vue.use(EditTable)
Vue.directive('drag', {
  bind(el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector('.poros-modal-header')
    const dragDom = el.querySelector('.poros-modal')
    if (!dialogHeaderEl) {
      return
    }
    dialogHeaderEl.style.cursor = 'move'

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop

      // 获取到的值带px 正则匹配替换
      let styL, styT

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/\px/g, '')
        styT = +sty.top.replace(/\px/g, '')
      }

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX
        const t = e.clientY - disY

        // 移动当前元素
        dragDom.style.left = `${l + styL}px`
        dragDom.style.top = `${t + styT}px`

        // 将此时的位置传出去
        // binding.value({x:e.pageX,y:e.pageY})
      }

      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  },
})
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
