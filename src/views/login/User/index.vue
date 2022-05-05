<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像，姓名 -->
      <van-cell>
        <!-- 使用title插槽来自定义标题 -->
        <template #icon>
          <img :src="$store.state.userPhoto" alt="" class="avatar" />
        </template>
        <template #title>
          <span class="username">{{ userObj.name }}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态关注粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{ userObj.art_count }}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{ userObj.fans_count }}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{ userObj.follow_count }}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link to="/user_edit"/>
      <van-cell icon="chat-o" title="小思同学" is-link to="/chat" />
      <van-cell icon="warning-o" title="退出登录" is-link @click="exitFn" />
    </van-cell-group>
  </div>
</template>

<script>
import { userAPI } from '@/api/index.js'
import { removeToken } from '@/utils/token.js'
import { mapMutations } from 'vuex'
// 这里当成函数，所以直接在当前组件调用
import { Dialog } from 'vant'
export default {
  data () {
    return {
      userObj: {}
    }
  },
  async activated () {
    const res = await userAPI()
    this.userObj = res.data.data
    // 直接调用mutations的方法
    // this.$store.commit('SET_USERPHOTO', this.userObj.photo)
    this.SET_USERPHOTO(this.userObj.photo)
  },
  methods: {
    // 映射调用mutations的方法
    ...mapMutations(['SET_USERPHOTO']),
    exitFn () {
      Dialog.confirm({
        title: '确定退出',
        message: '你真的要走了吗，不爱我了吗'
      }).then(() => { // promse对象，用户点确认选项->内部的resolve触发then
        // on confirm
        // 调用封装好的清空token的方法
        removeToken()
        this.$router.replace('/login')
        // console.log(this)
      })
        .catch(() => { // 点取消->内部的reject触发catch
          // on cancel
        })
    }
  }
}
</script>

<style scoped lang="less">
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>
