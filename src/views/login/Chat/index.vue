<template>
  <div class="container">
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="小思同学"
    ></van-nav-bar>
    <!-- 聊天主题区域 -->
    <div class="chat-list">
      <div v-for="(obj, index) in list" :key="index">
        <!-- 左边是小思 -->
        <div class="chat-item left" v-if="obj.name !== 'xm'">
          <van-image
            fit="cover"
            round
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
          <div class="chat-pao">{{ obj.msg }}</div>
        </div>
        <!-- 右侧是当前用户 -->
        <div class="chat-item right" v-else>
          <div class="chat-pao">{{ obj.msg }}</div>
          <van-image
            fit="cover"
            round
            :src="$store.state.userPhoto"
          />
        </div>
      </div>
    </div>
    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field placeholder="说点什么...." v-model="word">
        <template #button>
          <span style="font-size: 12px; color: #999" @click="sendFn">提交</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
// 导入socket.io-client包
import { io } from 'socket.io-client'
import { getToken } from '@/utils/token.js'
export default {
  data () {
    return {
      word: '', // 输入框的内容
      list: [
        { name: 'xs', msg: 'hi' },
        { name: 'xm', msg: 'hello' }
      ],
      socket: null // 定义变量，存储websocket实例
    }
  },
  created () {
    this.socket = io('http://toutiao.itheima.net', {
      query: {
        token: getToken()
      },
      transports: ['websocket']
    })
    this.socket.on('connect', () => { // 固定事件判定是否连接成功
      console.log('suceess')
    })
    // 接收后端传回的消息
    this.socket.on('message', obj => {
      this.list.push({
        name: 'xs',
        msg: obj.msg
      })
      // 最后一条信息滚动到底部
      this.$nextTick(() => {
        const theDiv = document.querySelector('.chat-list>div:last-child')
        theDiv.scrollIntoView({
          behavior: 'smooth'
        })
      })
    })
  },
  methods: {
    // 发送信息
    sendFn () {
      if (this.word.trim().length === 0) return
      this.socket.emit('message', {
        msg: this.word,
        timestamp: new Date().getTime()
      })
      // 将消息显示在页面
      this.list.push({
        msg: this.word,
        name: 'xm'
      })
      // 最后一条信息滚动到底部
      this.$nextTick(() => {
        const theDiv = document.querySelector('.chat-list>div:last-child')
        theDiv.scrollIntoView({
          behavior: 'smooth'
        })
      })
      // 清空输入框
      this.word = ''
    }
  },
  destroyed () {
    // 在组件销毁前，对socket对象进行关闭并清空
    this.socket.close()
    this.socket = null
  }
}
</script>

<style scoped lang="less">
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2c2c2;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
