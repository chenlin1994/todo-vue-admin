import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录界面',
    },
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    redirect:'/view-design',
    meta: {
      title: '首页',
      requireAuth: true,
    },
    children: [
      {
        path: 'view-design',
        name: 'view-design',
        component: () => import('@/views/pages/view-design.vue'),
        meta: {
          title: 'view-design',
          requireAuth: true,
        },
      },
      {
        path: 'ant-design-vue',
        name: 'ant-design-vue',
        component: () => import('@/views/pages/ant-design-vue.vue'),
        meta: {
          title: 'ant-design-vue',
          requireAuth: true,
        },
      },
    ],
  },
  {
    path: '**',
    redirect: '/',
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
