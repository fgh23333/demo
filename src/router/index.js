import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import BusinessList from '@/views/BusinessList.vue'
import BusinessInfo from '@/views/BusinessInfo.vue'
import AddressView from '@/views/AddressView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/businessList',
    name: 'businessList',
    component: BusinessList
  },
  {
    path: '/businessInfo',
    name: 'businessInfo',
    component: BusinessInfo
  },
  {
    path: '/addresses',
    name: 'Addresses',
    component: AddressView
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/CartView.vue') // 懒加载
  },
  {
    path: '/orderList',
    name: 'orderList',
    component: () => import('@/views/OrderView.vue') // 懒加载
  },
  {
    path: '/:catchAll(.*)', // 捕获所有未匹配的路由
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
