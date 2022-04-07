<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <van-list
   v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"
  :immediate-check="false"
  offset=50
>
    <!-- 文章列表 -->
    <ArticleItem
    v-for="obj in list"
    :key="obj.art_id"
    :artobj="obj"
    @reportEV = "reportFn"
     @dislikeEV = "dislikeFn"
    ></ArticleItem>
    </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from './ArticleItem.vue'
import { getArticlesAPI, dislikeArticleAPI, articReportAPI } from '@/api/index.js'
import { Notify } from 'vant'
export default {
  components: { ArticleItem },
  data () {
    return {
      list: [], // 文章列表数组
      loading: false, // 底部加载状态
      finished: false, // 底部完成状态
      timeend: new Date().getTime(), // 第一次使用当前时间
      isLoading: false// 顶部加载
    }
  },
  props: {
    channeId: Number
  },
  async created () {
    this.getArticle()
  },
  methods: {
    // 因为多次请求使用了相同的代码所以封装成一个函数，在对应阶段调用
    async getArticle () {
      const res = await getArticlesAPI(
        {
          channel_id: this.channeId,
          timestamp: this.timeend
        }
      )
      this.list = [...this.list, ...res.data.data.results]
      this.timeend = res.data.data.pre_timestamp // 通过最后一个文章的时间戳
      // 为了onLoad()事件
      this.loading = false
      if (res.data.data.pre_timestamp === null) {
        this.finished = true // 判断条件不一样就得注意代码的执行顺序
      }
      // 为了顶部加载事件
      this.isLoading = false
    },
    // 底部加载事件
    async onLoad () {
      this.getArticle()
    },
    // 顶部刷新事件，情况list然后重新获取一批
    async onRefresh () {
      this.list = []
      this.timeend = new Date().getTime()
      this.getArticle()
    },
    // 反馈对文章不感兴趣事件
    async dislikeFn (id) {
      const res = await dislikeArticleAPI({
        artId: id
      })
      console.log(res)
      Notify({ type: 'success', message: '反馈成功' })
    },
    // 对文章内容进行举报
    async reportFn (id, value) {
      await articReportAPI({
        artId: id,
        type: value
      })
      Notify({ type: 'success', message: '举报成功' })
    }
  }
}

</script>
<style>
</style>
