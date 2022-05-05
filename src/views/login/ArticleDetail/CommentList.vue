<template>
  <div>
    <!-- 评论列表 -->
    <div
      class="cmt-list"
      :class="{
        'art-cmt-container-1': isShowCmtBox,
        'art-cmt-container-2': !isShowCmtBox,
      }"
    >
      <!-- 评论的Item -->
      <van-list
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="cmt-item" v-for="item in comment" :key="item.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="item.aut_photo" alt="" class="avatar" />
              <span class="uname">{{ item.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon
                name="like"
                size="16"
                color="red"
                v-if="item.is_liking === true"
                @click="likeFn(false, item)"
              />
              <van-icon
                name="like-o"
                size="16"
                color="gray"
                v-else
                @click="likeFn(true, item)"
              />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{ item.content }}
            <!-- 尾部 -->
            <div class="cmt-footer">{{ timeAgo(item.pubdate) }}</div>
          </div>
        </div>
      </van-list>
    </div>

    <!-- 增加评论 ，兄弟关系才可以用v-if-->
    <div class="add-cmt-box van-hairline--top" v-if="isShowCmtBox === true">
      <van-icon
        name="arrow-left"
        size="0.48rem"
        @click="$router.back()"
      ></van-icon>
      <div class="ipt-cmt-div" @click="isShowFn">发表评论</div>
      <div class="icon-box">
        <van-badge :content="totalCount === 0 ? '' : totalCount" max="99">
          <van-icon
            name="comment-o"
            size="0.53333334rem"
            @click="commentscrollFn"
          ></van-icon>
        </van-badge>
        <van-icon name="star-o" size="0.53333334rem"></van-icon>
        <van-icon name="share-o" size="0.53333334rem" />
      </div>
    </div>
    <!-- 增加评论2 -->
    <div class="cmt-box van-hairline--top" v-else>
      <textarea
        placeholder="友善评论，理性发言，阳光心灵"
        v-fouceEv
        @blur="blurFn"
        v-model.trim="comtext"
      ></textarea>
      <van-button
        type="default"
        :disabled="comtext.length === 0"
        @click="sendFn"
        >发布</van-button
      >
    </div>
  </div>
</template>

<script>
import {
  getcommentsAPI,
  unlikeAIP,
  likeAPI,
  sendcommentAPI
} from 'api/index.js'
import { timeAgo } from '@/utils/date.js'
export default {
  data () {
    return {
      offset: null,
      comment: [],
      timeAgo,
      isShowCmtBox: true,
      totalCount: '',
      comtext: '',
      finished: false, // 是否加载完毕
      loading: false
    }
  },
  async created () {
    const res = await getcommentsAPI({
      id: this.$route.query.art_id
    })
    this.comment = res.data.data.results
    this.totalCount = res.data.data.total_count // 评论的总数量
    this.lastId = res.data.data.last_id // 第一次加载的评论的最后一条的id
    if (res.data.data.results.length === 0) {
      this.finished = true
    }
  },
  methods: {
    async likeFn (boo, obj) {
      // 取消对评论的喜欢
      if (boo === false) {
        obj.is_liking = boo
        await unlikeAIP({
          commentId: obj.com_id
        })
      } else {
        obj.is_liking = boo
        await likeAPI({
          id: obj.com_id
        })
      }
    },
    // 显示评论输入框
    isShowFn () {
      this.isShowCmtBox = false
    },
    // 点击滑动到评论
    commentscrollFn () {
      // scrollIntoView是html5的新标签，让选择的原生标签滚到屏幕最上面
      // 即能滚动又带动画
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    },
    // 发布评论事件
    async sendFn () {
      // console.log(this.context)
      const res = await sendcommentAPI({
        id: this.$route.query.art_id,
        content: this.comtext
      })
      this.comment.unshift(res.data.data.new_obj)
      this.totalCount++
      this.comtext = ''
    },
    blurFn () {
      // 绑定定时器的原因是因为，当我们点击了发布按钮，textarea就失去了焦点，因为是v-if,所以组件会被销毁，v-model来不及绑定数据
      // 定时器会在vue的代码执行后再执行
      setTimeout(() => {
        this.isShowCmtBox = true
      }, 0)
    },
    // 滑动加载评论
    async onLoad () {
      if (this.comment.length > 0) {
        const res = await getcommentsAPI({
          id: this.$route.query.art_id,
          offset: this.lastId
        })
        this.comment = [...this.comment, ...res.data.data.results]
        this.totalCount = res.data.data.total_count // 评论的总数量
        this.lastId = res.data.data.last_id // 第一次加载的评论的最后一条的id
        if (res.data.data.last_id === null) {
          this.finished = true
        }
        this.loading = false
      } else {
        this.loading = false
      }
    }
  }
}
// 想实现分享需要去对应平台的开发者平台去申请权限
</script>

<style scoped  lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
//外部容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}
//发布评论的盒子
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}
.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}
//发布评论的盒子2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
