<template>
  <div class="user-edit-contaion">
    <!-- header区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />
    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell is-link />
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
             width="50"
            height="50"
            round
            :src="userObj.photo"
            @click="imgFn"
          />
          <!-- v-show视觉上隐藏，但是标签还在还可以触发功能
          v-if则是直接被销毁了 -->
          <input type="file"
          ref="iptFile"
          v-show="false"
          accept="image/*"
          @change="onFileChange"
          />
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="userObj.name" @click="nameFn"/>
      <van-cell title="生日" is-link  :value="userObj.birthday" @click="birthdayFn"/>
    </van-cell-group>
    <!-- 修改名字弹窗 -->
    <van-dialog v-model="show" title="标题" show-cancel-button v-fouceEv :beforeClose="closeFn" >
    <input type="text" v-model="username">
</van-dialog>
<van-popup v-model="dialogshow" position="bottom" :style="{ height: '50%' }" round>
<van-datetime-picker
  v-model="currentDate"
  type="date"
  title="选择年月日"
  :min-date="minDate"
  :max-date="maxDate"
  @cancel="dataCancelFn"
  @confirm="confirmFn"
/>
</van-popup>
  </div>
</template>

<script>
import { userallAPI, userphotoAPI, usermesAPI } from '@/api/index.js'
import Notify from '@/ui/Notify.js'
import { formatDate } from '@/utils/date.js'
import { mapMutations } from 'vuex'
export default {
  name: 'UserEdit',
  async created () {
    const res = await userallAPI()
    this.userObj = res.data.data
  },
  data () {
    return {
      userObj: {},
      show: false,
      username: '', // 输入框的名字
      minDate: new Date(1980, 0, 1),
      maxDate: new Date(), // 最大范围默认获取系统时间
      currentDate: new Date(2022, 3, 27), // 日历显示的第一个时间
      dialogshow: false // 选择生日是否展示
    }
  },
  methods: {
    ...mapMutations(['SET_USERPHOTO']),
    // 图片点击事件
    imgFn () {
      this.$refs.iptFile.click()// js模拟标签的事件被点击触发
    },
    // 选择头像
    async onFileChange (e) {
      if (e.target.files[0].length === 0) return// 用户点了取消没有选择头像
      const theFd = new FormData()
      //   console.log(e.target.files[0])
      theFd.append('photo', e.target.files[0])
      const res = await userphotoAPI(theFd)
      this.userObj.photo = res.data.data.photo
      this.SET_USERPHOTO(res.data.data.photo)
    },
    // 修改名字
    nameFn () {
      this.show = true
      this.username = this.userObj.name
      this.userObj.name = this.username

      // this.SET_USERNAME(this.username)
    },
    // 关闭弹窗前
    async closeFn (action, done) {
    // 用正则表达式去匹配1-7位数字汉字和英文字母的组合
      if (action === 'confirm') {
        const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/
        // 然后调用正则里面的test方法进行验证看要验证的对象是否符合要求，并返回布尔值
        if (reg.test(this.username) === true) {
          await usermesAPI({
            name: this.username
          })
          this.userObj.name = this.username
          // this.SET_USERNAME(this.username)
          // 通过了验证
          done()
        } else {
          Notify({ type: 'warning', message: '用户名只能是1-7位中英数字组合' })
          done(false)
        }
      } else {
        done()
      }
    },
    // 修改生日
    birthdayFn () {
      this.dialogshow = true
      this.currentDate = new Date(this.userObj.birthday)// 将字符串生日转化成日期类型
    },
    // 取消生日
    dataCancelFn () {
      this.dialogshow = false
    },
    // 确定生日
    async confirmFn () {
      await usermesAPI({
        birthday: formatDate(this.currentDate)
      })
      this.dialogshow = false
      this.userObj.birthday = formatDate(this.currentDate)
    }
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;

}
/deep/ .van-dialog__content{
  text-align: center;
  input{
    text-align: center;
    outline: none;
    border: none;
  }
}
</style>
