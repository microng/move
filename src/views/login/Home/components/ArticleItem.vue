<template>
 <div>
      <!-- 一条文章单元格 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
          <div class="title-box">
        <span >{{ artobj.title }}</span>
        <!-- 单图 -->
        <img v-if="artobj.cover.type===1" :src="artobj.cover.images[0]" class="thumb">
        </div>
        <!-- 多图 -->
        <div class="thumb-box" v-if="artobj.cover.type>1">
          <img v-for="(imgUrl, index) in artobj.cover.images" :key="index" :src="imgUrl" class="thumb">
        </div>
      </template>
      <!-- label区域的插槽 -->
      <template #label>
          <div class="label-box">
            <div>
                <span>{{ artobj.aut_name }}</span>
                <span>{{ artobj.comm_count }}评论</span>
                <span>{{formTime(artobj.pubdate) }}个月前</span>
            </div>
            <!-- 反馈按钮 这是那个×-->
        <van-icon name="cross" @click="show = true" />
         </div>
      </template>
    </van-cell>
    <!-- 反馈面板 -->
    <van-action-sheet
    v-model="show"
    :actions="actions"
    @select="onSelect"
    @cancel= "cancelFn"
    @close = "closeFn"
    get-container="body"
      :cancel-text="bottomText"
       />
 </div>
</template>

<script>
import { timeAgo } from '@/utils/date.js'
import { firstActions, secondActions } from '@/api/report.js'
export default {
  data () {
    return {
      show: false,
      actions: firstActions,
      bottomText: '取消'
    }
  },
  props: {
    artobj: Object
  },
  methods: {
    formTime: timeAgo, // 引入方法处理文件几个月前
    onSelect (actions) {
      // actions是name{不感兴趣}等，item是索引值
      if (actions.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.bottomText = '返回'
      } else if (actions.name === '不感兴趣') {
        this.$emit('dislikeEV', this.artobj.art_id)
        this.show = false
      } else {
        this.$emit('reportEV', this.artobj.art_id, actions.value)
        this.show = false // 关闭面板
      }
    },
    // 实现点击底部按钮进行区分判断
    cancelFn () {
      if (this.bottomText === '返回') {
        this.show = true
        this.actions = firstActions
        this.bottomText = '取消'
      }
    },
    // 解决点击遮罩后，再点同一个×显示二级面板
    closeFn () {
      this.actions = firstActions
      this.bottomText = '取消'
    }
  }
}
</script>

<style scoped lang="less">
// 标题样式
.title-box {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
//   label描述样式
.label-box {
   display: flex;
   justify-content: space-between;
   align-items: center;
  }
//文章信息sapn
.label-box span{
    margin: 0 3px;
    &:first-child{
        margin-left: 0 ;
    }
}
//图片样式
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}
//三图
.thumb-box{
  display: flex;
  justify-content: space-between;
}
</style>
