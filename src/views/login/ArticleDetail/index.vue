<template>
  <div>

    <!-- Header区域 -->

    <van-nav-bar
      title="文章详情"
      left-arrow
      @click-left="$router.go(-1)"
      fixed
    />
    <!-- 文章加载区域 -->
    <van-loading
      size="24px"
      color="#0094ff"
      v-if="Object.keys(articobj).length === 0"
      >文章加载中...</van-loading
    >
    <div v-else>
      <!-- 文章信息区域 -->
      <div class="article-container">
        <!-- 文章标题 -->
        <h1 class="art-title">{{ articobj.title }}</h1>
        <!-- 用户信息 -->
        <van-cell
          center
          :title="articobj.aut_name"
          :label="timeAgo(articobj.pubdate)"
        >
          <!-- 使用 title 插槽来自定义标题 -->
          <template #icon>
            <img :src="articobj.aut_photo" alt="图片不存在" class="avatar" />
          </template>

          <template #default>
            <div>
              <van-button
                type="info"
                size="mini"
                v-if="articobj.is_followed"
                @click="followedFn(true)"
                >已关注</van-button
              >
              <van-button
                icon="plus"
                type="info"
                size="mini"
                plain
                @click="followedFn(false)"
                v-else
                >关注</van-button
              >
            </div>
          </template>
        </van-cell>
        <!-- 分割线 -->
        <van-divider></van-divider>
        <!-- 文章内容 -->
        <div class="art-content" v-html="articobj.content"></div>
        <!-- 分割线 -->
        <van-divider>End</van-divider>
        <!-- 点赞 -->
        <!--  attitude  用户对文章的态度, -1: 无态度，0-不喜欢，1-点赞 -->
        <div class="like-box">
          <van-button
            icon="good-job"
            type="danger"
            size="small"
            v-if="articobj.attitude === 1"
            @click="likeFn(true)"
            >已点赞</van-button
          >
          <van-button
            icon="good-job-o"
            type="danger"
            plain
            size="small"
            v-else
            @click="likeFn(false)"
            >点赞</van-button
          >
        </div>
      </div>
      <!-- 评论 -->
      <CommentList></CommentList>
    </div>
  </div>
</template>

<script>
import {
  articdetailAPI,
  userfollwAPI,
  unuserfollwAPI,
  likeartAPI,
  unlikeartAPI
} from '@/api/index.js'
import { timeAgo } from '@/utils/date.js'
import CommentList from './CommentList.vue'
export default {
  name: 'Search',
  data () {
    return {
      articobj: {},
      timeAgo
    }
  },
  components: {
    CommentList
  },
  async created () {
    const res = await articdetailAPI({
      articId: this.$route.query.art_id
    })
    this.articobj = res.data.data
  },
  methods: {
    // 接受处理时间的第三方方法这个局部变量
    // formtime: timeAgo,
    //  关注与取消关注事件
    async followedFn (bool) {
      if (bool === true) {
        // 用户点在已关注上面，要取消关注
        this.articobj.is_followed = false
        await unuserfollwAPI({
          userId: this.articobj.aut_id
        })
      } else {
        // 用户点的关注按钮
        this.articobj.is_followed = true
        await userfollwAPI({
          userId: this.articobj.aut_id
        })
      }
    },
    // 点赞与取消点赞
    async likeFn (bool) {
      // 点击了已点赞要取消点赞
      if (bool === true) {
        // 这里是给上面的进行赋值
        this.articobj.attitude = 0
        // 调用取消点赞的接口
        await unlikeartAPI({
          artId: this.articobj.art_id
        })
      } else {
        this.articobj.attitude = 1
        await likeartAPI({
          artId: this.articobj.art_id
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}
.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
.van-cell {
  padding: 5px 0;
  //&表示对父选择器的引用
  & ::after {
    display: none;
  }
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}
.like-box {
  display: flex;
  justify-content: center;
}
.van-loading {
  text-align: center;
  padding-top: 46px;
}
</style>
