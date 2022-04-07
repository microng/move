import Vue from 'vue'
import Router from 'vue-router'
import Login from 'views/login/index.vue'
import Layout from 'views/login/Layout/index.vue'
import Home from 'views/login/Home/index.vue'
import User from 'views/login/User/index.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/layout/home' // 默认显示
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/layout',
      component: Layout,
      children: [
        {
          path: 'home',
          component: Home
        },
        {
          path: 'user',
          component: User
        }
      ]
    }
  ]
})
