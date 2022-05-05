// 基于axios封装网络请求
import theAxios from 'axios'
import router from '@/router.js'
// import { Notify } from 'vant'
import { getToken, removeToken } from '@/utils/token.js'
// import { getNewTokenAPI } from '@/api/index.js'
const axios = theAxios.create({
  baseURL: 'https://toutiao.itheima.net/',
  timeout: 20000

})
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 目标:统一携带token
  // 先判断本地有token再携带，判断具体api/index.js里如果没有携带Authorzation,再添加
  // 未定义叫undefined，null具体的值你得赋予才为空
  // ?.可选操作符，如果前面对象里没有length，整个表达式原地返回unfined
  // 如果getToken()在原地有值token字符串才能用Length获取到长度
  if (getToken() && getToken().length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, async function (error) {
  console.log(error)
  // 对响应错误做点什么
  // 401代表身份过期，需要重新跳转到登录
  if (error.response.status === 401) {
    // 不能使用this.$router进行跳转，因为这里的this指向不是vue组件
    // this.$router是为了拿到路由对象，既然不能拿，就直接引用router文件
    // Notify({ type: 'warning', message: '身份已过期' })
    removeToken()// 先清空才是使路由守卫生效
    // 方法一强制跳转
    // router.replace('/login')
    // const res = await getNewTokenAPI()
    // setToken(res.data.data.token)
    // error.config.headers.Authorization = `Bearer ${res.data.data.token}`
    // return axios(error.config)
    router.replace(`/login?path=${router.currentRoute.fullPath}`)
  }
  // else if (error.response.status === 500 && error.config.url === '/v1_0/authorizations' && error.config.method === 'put') {
  //   // 当refresh_token也过期后
  //   localStorage.clear()
  //   Notify({ type: 'warning', message: '身份已过期' })
  //   router.replace('/login')
  // }
  // 对请求错误做些什么
  return Promise.reject(error)
})
export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => {
  return axios({
    url,
    method,
    params,
    data,
    headers
  })
}
