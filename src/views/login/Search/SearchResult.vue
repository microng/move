<template>
  <div>
    <!-- 头部导航栏 -->
    <div class="search-result-container">
      <van-nav-bar
        title="搜索结果"
        left-arrow
        @click-left="$router.go(-1)"
        fixed
      />
    </div>
    <!-- 文章列表 -->
    <div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <ArticleItem
          v-for="obj in suggresult"
          :key="obj.art_id"
          :artobj="obj"
          :isshow="false"
          @click.native="showartic(obj.art_id)"
        >
        </ArticleItem>
      </van-list>
    </div>
  </div>
</template>

<script>
import { suggestResultAPI } from 'api/index.js'
// components下面是全局组件
import ArticleItem from 'components/ArticleItem.vue'
export default {
  name: 'SearchResult',
  data () {
    return {
      page: 1,
      suggresult: [],
      loading: false,
      finished: false
    }
  },
  async created () {
    const res = await suggestResultAPI({
      page: this.page,
      q: this.$route.params.kw
    })
    this.suggresult = res.data.data.results
  },
  components: {
    ArticleItem
  },
  methods: {
    async onLoad () {
      // 当列表长度不为0
      if (this.suggresult.length > 0) {
        this.page++
        const res = await suggestResultAPI({
          page: this.page,
          q: this.$route.params.kw
        })
        // 当内容加载完毕
        if (res.data.data.results.length === 0) {
          this.finished = true
          return
        }
        this.suggresult = [...this.suggresult, ...res.data.data.results]
        this.loading = false
      }
    },
    // 搜索结果中跳转到文章详情
    showartic (id) {
      this.$router.push({
        path: `/articdetail?art_id=${id}`
      })
    }
  }
}
</script>
<style scoped lang="less">
.search-result-container {
  padding-top: 46px;
}
</style>
