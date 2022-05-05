import '@/utils/console.js'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'highlight.js/styles/default.css'
import directiveObj from './utils/directiveObj.js'
import 'amfe-flexible'
import './VueComponent'// vant组件库
Vue.use(directiveObj)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
