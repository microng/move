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
          <van-icon name="search" size="0.48rem" color="#fff" @click="searchshow" />
        </template>
      </van-nav-bar>
    </div>
    <!-- Tab栏导航 -->
    <div class="contain">
      <!-- 粘性布局，会定位到最顶部，所以需要挤下来 -->
      <van-tabs
       v-model="active"
        sticky
        @change="channelChangeFn"
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
      <!-- 编辑频道图标 -->
      <van-icon name="plus" size="0.373333334rem" class="moreChannels" @click="iconFn" get-container="body"/>
    </div>
    <!-- 标签弹出层 -->
    <van-popup v-model="show" class="mypopup">
      <ChannelEdit
      :unCheck="unCheckChannel"
      :userChanne ="userChanneList"
      @addEV= "addChannelList"
      @deletEV = "deletFn"
      @closeEV= "closeFn"
      ref="editref"
      v-model="active"
      ></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import ArticleList from './components/ArticleList.vue'
import { getUserChannelsAPI, getAllChannelsAPI, updataUserChannelAPI, deletUserChannelAPI } from '@/api'
import ChannelEdit from './ChannelEdit.vue'
export default {
  data () {
    return {
      active: 0, // 被激活的Tab
      userChanneList: [],
      articlelists: [],
      allCahnnelList: [],
      show: false,
      channelScroll: {}

    }
  },
  // created只会调用一次，所以需要重新定义方法获取文章数据
  async created () {
    // 获取频道
    const res = await getUserChannelsAPI()
    // console.log(res)
    this.userChanneList = res.data.data.channels
    // 获取所有频道
    const res2 = await getAllChannelsAPI()
    this.allCahnnelList = res2.data.data.channels
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  methods: {
    iconFn () {
      this.show = true
    },
    // 添加用户频道
    async addChannelList (obj) {
      this.userChanneList.push(obj)
      const res = await updataUserChannelAPI({
        channels: this.userChanneList
      })
      console.log(res)
    },
    // 删除用户频道
    async deletFn (obj) {
      const index = this.userChanneList.findIndex(channel => channel.id === obj.id)
      this.userChanneList.splice(index, 1)
      const res = await deletUserChannelAPI({
        channelId: obj.id
      })
      console.log(res)
    },
    // 关闭面板并且将编辑的叉叉关闭
    closeFn () {
      this.show = false
      this.$refs.editref.isEidt = false
    },
    // 出现搜索页面
    searchshow () {
      this.$router.push('/search')
    },
    // 监听滚动事件
    scroolFn () {
      this.$route.meta.scrollHeigh = document.documentElement.scrollTop || document.body.scrollTop
      this.channelScroll[this.active] = document.documentElement.scrollTop || document.body.scrollTop
    },
    // Tab栏切换事件
    channelChangeFn () {
      this.$nextTick(() => {
        document.documentElement.scrollTop = this.channelScroll[this.active]
        document.body.scrollTop = this.channelScroll[this.active]
      })
    }
  },
  // 滚动监听事件，路由切换时
  activated () {
    window.addEventListener('scroll', this.scroolFn)
    document.documentElement.scrollTop = this.$route.meta.scrollHeigh
    document.body.scrollTop = this.$route.meta.scrollHeigh
  },
  computed: {
    // 把所有频道数组挨个对象取出，去用户已选频道数组里查找，找不到就用fifter收集到一个新数组里
    unCheckChannel () {
      const newArr = this.allCahnnelList.filter(bigObj => {
        const index = this.userChanneList.findIndex(smallObj => {
          return smallObj.id === bigObj.id
        })
        if (index > -1) {
          return false
        } else {
          return true
        }
      })
      return newArr
    }
  },
  deactivated () {
    window.removeEventListener('scroll', this.scroolFn)
  }

}
</script>

<style scoped lang="less">
.logo {
  width: 40px;
  height: 40px;
  margin-top: 5px;
}
.contain{
    padding-top:46px ;
}
//设置tabs容器样式
/deep/.van-tabs__wrap {
padding-right: 30px;
background-color:#fff ;
}
//设置小图标样式
.moreChannels{
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}
.mypopup{
  width: 100vw;
  height: 100vh;
  //如果想设置为100%就需要给body和html设置100%
  background-color:#fff ;
}
</style>
