<template>
  <div>
    <!-- 头部导航 -->
    <div>
      <van-nav-bar fixed>
        <template #left>
          <div>
            <img src="@/assets/icon.png" alt="" class="logo" />
          </div>
        </template>
        <template #right>
          <!-- postcss只能翻译style里的css代码，标签行内样式无法通过它将px转化为rem需要自己手动计算 -->
          <van-icon name="search" size="0.48rem" color="#fff" />
        </template>
      </van-nav-bar>
    </div>
    <!-- Tab栏导航 -->
    <div class="contain">
      <!-- 粘性布局，会定位到最顶部，所以需要挤下来 -->
      <van-tabs
       v-model="active"
        sticky
         offset-top="1.226667rem"
         animated
          >
        <van-tab
        v-for="obj in userChanneList "
        :key="obj.id"
        :title="obj.name"
        :name="obj.id"
      >
         <ArticleList :channeId="obj.id"></ArticleList>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import ArticleList from './components/ArticleList.vue'
import { getUserChannelsAPI } from '@/api'
export default {
  data () {
    return {
      active: 0,
      userChanneList: [],
      articlelists: []
    }
  },
  // created只会调用一次，所以需要重新定义方法获取文章数据
  async created () {
    // 获取频道
    const res = await getUserChannelsAPI()
    // console.log(res)
    this.userChanneList = res.data.data.channels
    // 获取文章
  },
  components: {
    ArticleList
  }

}
</script>

<style>
.logo {
  width: 40px;
  height: 40px;
  margin-top: 5px;
}
.contain{
    padding-top:46px ;
}
</style>
