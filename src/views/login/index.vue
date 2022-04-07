<template>
  <div>
      <van-nav-bar title="黑马头条-登录" />
  <!-- 整个表单组件
   @submit 是一个自定义事件
   输入框name属性 = "用户名" name会收集输入框的值即kwy value是输入的
   表单整体提交时，默认收集一个提交对象，往后台发生的参数名就是name里值
   {"用户名":'页面值'}
   2.label属性输入框左侧文本
   3.rules属性配置检验规则
   :属性名="表达式"
   属性名="字符串"
  -->
      <van-form @submit="onSubmit">
  <van-field
    v-model="user.mobile"
     required
    name="mobile"
    label="手机号"
    placeholder="请输入11位手机号"
    :rules="[{ required: true, message: '请填写手机号',pattern: /^1[3-9]\d{9}$/  }]"
  />
  <van-field
    v-model="user.code"
    required
    type="password"
    name="code"
    label="密码"
    placeholder="请输入6位密码"
    :rules="[{ required: true, message: '请填写密码', pattern: /^\d{6}$/ }]"
  />
  <div style="margin: 16px;">
    <van-button round block type="info" native-type="submit"
    :disabled= "isloading"
    :loading = "isloading"
    loading-text="正在登陆"
    >登录</van-button>
  </div>
</van-form>
  </div>
</template>

<script>
import { loginAPI } from '@/api'
import { Notify } from 'vant'
import { setToken } from '@/utils/token'
export default {
  data () {
    return {
      user: {
        // 参照后台接口文件
        mobile: '', // 手机号
        code: '' // 这里必须是246810是后台规定的
      },
      isloading: false
    }
  },
  methods: {
    async onSubmit (values) {
      this.isloading = true
      try {
        const res = await loginAPI(this.user)
        // console.log(res)
        Notify({ type: 'success', message: '登录成功' })
        setToken(res.data.data.token)
        this.$router.replace({
          path: '/layout/home'
        })
      } catch (err) {
        // 抛出错误会直接进入这里
        Notify({ type: 'danger', message: '账号或密码错误' })
      }
      this.isloading = false
    }
  }
}
</script>

<style scoped lang="less">

.van-nav-bar{
  background-color:#007bff;
}
/deep/ .van-nav-bar__title{
  color: white;
}
</style>
