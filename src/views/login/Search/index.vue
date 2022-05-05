<template>
<div>
  <div class="search-header">
      <!-- 后退按钮 -->
     <van-icon name="arrow-left" color="white" size="0.48rem" class="goback" @click="$router.back()"/>
     <!-- 搜索组件 -->
     <van-search
     v-model.trim="kw"
     v-fouceEv
     placeholder="请输入搜索关键词"
     background="#007BFF"
     shape="round"
     @input="inputEV"
     @search="searchFn"/>
  </div>
  <!-- 显示搜索建议 -->
  <div class="sugg-list" v-if="kw.length!==0">
    <!-- 模板里面不能解析标签，所以要使用v-html -->
  <div class="sugg-item" v-for="(obj,index) in suggsetList" :key="index" v-html="lightFn(obj,kw)" @click="suggestFn(obj)"></div>
  </div>
  <!-- 搜索历史 -->
  <div class="search-history" v-else>
    <van-cell title="搜索历史" >
  <!-- 使用 right-icon 插槽来自定义右侧图标 -->
  <template #right-icon>
    <van-icon name="delete" class="search-icon" @click="clearFn"/>
  </template>
</van-cell>
<!-- 历史列表 -->
<div class="history-list">
  <span class="history-item" v-for="(item,index) in history" :key="index" @click="historyFn(item)">
    {{item}}
  </span>
</div>
  </div>
  </div>
</template>

<script>
import { suggestAPI } from '@/api/index.js'
import { setStorage, getStorage } from '@/utils/Storage.js'
export default {
  name: 'Search',
  data () {
    return {
      kw: '', // 搜索关键词
      timer: null, // 防抖定时器
      suggsetList: [], // 搜索建议
      history: JSON.parse(getStorage('formerly')) || []
    }
  },
  methods: {
    // 防抖操作
    inputEV () {
      clearInterval(this.timer)
      this.timer = setTimeout(async () => {
        if (this.kw.length === 0) { this.suggsetList = [] } else {
          const res = await suggestAPI({
            keyword: this.kw
          })
          this.suggsetList = res.data.data.options
        }
      }, 500)
    },
    //  使关键字高亮
    // 这里的origstr指的是原本的字符串，即请求回来的字符串的形参,str指要替换的值
    lightFn (origstr, str) {
      // 正则表达式的简写不能直接识别变量，要完整写法
      const reg = new RegExp(str, 'ig')
      let str1 = origstr || ''
      return str1.replace(reg, (match) => {
        return `<span style="color:red;">${match}</span>`
      })
    },
    // 三种跳转事件
    // 封装跳转事件方法
    moveFn (str) {
      setTimeout(() => {
        this.$router.push({
          path: `/searchresult/${str}`
        })
      }, 0)
    },
    searchFn () {
      // 进行本地存储
      // 异步宏任务是最后执行的
      if (this.kw.length > 0) {
        this.history.push(this.kw)
        this.moveFn(this.kw)
      }
    },
    historyFn (str) {
      this.$router.push({
        name: 'searchchange',
        params: {
          kw: str

        }
      })
    },
    suggestFn (str) {
      if (this.kw.length > 0) {
        this.history.push(str)
        this.moveFn(str)
      }
    },
    // 清除历史记录
    clearFn () {
      this.history = []
    }
  },
  // 使用侦听器
  watch: {
    history: {
      deep: true,
      handler () {
        const theSet = new Set(this.history)
        // Set类型对象转回Array数组类型
        const arr = Array.from(theSet)
        setStorage('formerly', JSON.stringify(arr))
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-header{
    height: 46px;
    display: flex;
    align-items: center;
    background-color: #007bff;
    overflow: hidden;
    /*后退按钮*/
    .goback{
        padding-left:14px ;
    }
    /*搜索组件 */
    .van-search{
        flex: 1;
    }
}
// 搜索建议
 .sugg-list {
     .sugg-item{
         padding: 0 15px;
         border-bottom:1px solid #f8f8f8;
         font-size: 14px;
         line-height: 50px;
         //实现省略号
         white-space:nowrap;
         overflow:hidden;
         text-overflow:ellipsis;
     }
 }
//  搜索历史
.search-icon {
  font-size: 16px;
  line-height: inherit;
}
.history-list{
  padding: 0 10px;
  .history-item{
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color:#efefef;
    margin: 10px 8px 0px 8px ;
    border-radius: 10px;
  }
}
</style>
