import Vue from 'vue'
import VueRouter from 'vue-router'
// import Router from 'vue-router'
import { getToken } from '@/utils/token.js'
// import Login from 'views/login/index.vue'
// import Layout from 'views/login/Layout/index.vue'
// import Home from 'views/login/Home/index.vue'
// import User from 'views/login/User/index.vue'
// import Search from 'views/login/Search/index.vue'
// import SearchResult from 'views/login/Search/SearchResult.vue'
// import ArticleDetail from 'views/login/ArticleDetail'
// import UserEdit from 'views/login/User/UserEdit.vue'
// import Chat from 'views/login/Chat/index.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home' // 默认显示
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ 'views/login/index.vue')
  },
  {
    path: '/layout',
    component: () => import(/* webpackChunkName: "Layout" */ 'views/login/Layout/index.vue'),
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "Home" */ 'views/login/Home/index.vue'),
        meta: { scrollHeigh: 0 }
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName: "User" */ 'views/login/User/index.vue')
      }
    ]
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "Search" */ 'views/login/Search/index.vue')
  },
  {
    // 路由传参params
    name: 'searchchange',
    path: '/searchresult/:kw',
    component: () => import(/* webpackChunkName: "SearchResult" */ 'views/login/Search/SearchResult.vue')
  },
  // 文章详情页面
  {
    path: '/articdetail',
    component: () => import(/* webpackChunkName: "ArticleDetail" */ 'views/login/ArticleDetail')
  },
  // 个人信息
  {
    path: '/user_edit',
    component: () => import(/* webpackChunkName: "UserEdit" */ 'views/login/User/UserEdit.vue')
  },
  // 聊天
  {
    path: '/chat',
    component: () => import(/* webpackChunkName: "Chat" */ 'views/login/Chat/index.vue')
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (getToken() && getToken().length > 0 && to.path === '/login') {
    // next(false) 有弊端
    next('/login/home')
  } else {
    next()
  }
})
export default router
