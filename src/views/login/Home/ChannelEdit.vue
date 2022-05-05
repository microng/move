<template>
  <div>
      <!-- 弹出层的头部 -->
      <van-nav-bar title="频道管理">
          <template #right>
              <van-icon name="cross" size="0.37333334rem" color="white" @click="closeFn"/>
          </template>
      </van-nav-bar>
      <!-- 我的频道 -->
      <div class="my-channel-box">
          <div class="channel-title">
              <span>
                  我的频道
                  <span class="small-title">
                      <!-- 三目运算符控制span显示 -->
                      点击{{isEidt?"完成":"编辑"}}频道
                  </span>
              </span>
              <span @click="EditFn">{{isEidt?"完成":"编辑"}}</span>
          </div>
          <!-- 我的频道列表 -->
          <van-row type="flex">
              <van-col span="6"
              v-for="obj in userChanne"
              :key="obj.id"
              @click="delet(obj)"
              >
                  <div class="channel-item van-hairline--surround">
                      {{obj.name}}
                      <!-- 删除的徽标 -->
                    <van-badge color="transparent" class="cross-badge" v-show="isEidt && obj.id!=0">
                    <template #content>
                        <van-icon
                        name="cross"
                        class="badge-icon"
                        color="#cfcfcf"
                        size="0.32rem"
                        >
                        </van-icon>
                    </template>
                     </van-badge>
                  </div>
              </van-col>
          </van-row>
      </div>
      <!-- 更多频道 -->
      <div class="more-channel-box">
          <div class="channel-title">
              <span>点击添加更多频道：</span>
          </div>
      </div>
      <!-- 更多频道列表 -->
      <van-row type="flex">
          <van-col span="6" v-for="obj in unCheck" :key="obj.id"  @click="addChannel(obj)">
              <div class="channel-item van-hairline--surround">{{obj.name}}</div>
        </van-col>
      </van-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isEidt: false// 控制编辑频道的叉是否显示
    }
  },
  props: {
    unCheck: Array,
    userChanne: Array
  },
  methods: {
    EditFn () {
      this.isEidt = !this.isEidt
    },
    // 在这里直接push也可以实现，但是修改了props的值，违背了单向数据流，所以使用发射事件
    addChannel (obj) {
      if (this.isEidt === true) {
        this.$emit('addEV', obj)
      }
    },
    // 删除用户频道
    delet (obj) {
      if (this.isEidt === true) {
        if (obj.id !== 0) { this.$emit('deletEV', obj) }
      } else { // 切换频道
        this.$emit('closeEV')
        this.$emit('input', obj.id)
      }
    },
    // 关闭频道面板
    closeFn () {
      this.$emit('closeEV')
    }
  }
}
</script>

<style scoped lang="less">
.van-popup,.popup-cantainer {
background-color: transparent;
height: 100%;
width: 100%;
}
.popup-container{
    display: flex;
    flex-direction: column;
}
.pop-header{
    height: 90px;
    background-color:#007bff;
    color: white;
    text-align: center;
    position: relative;
    .title{
    width: 100%;
    position: absolute;
    bottom: 15px;
}
}
.pop-body{
    flex: 1;
    overflow: scroll;
    padding: 8px;
    background-color:white ;
}
.my-channel-box,
.more-channel-box{
    .channel-title{
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        line-height: 28px;
        padding: 0 6px;
    }
}
.channel-item{
    font-size: 12px;
    text-align: center;
    line-height: 36px;
    background-color:#fafafa ;
    margin: 5px;
}
//删除的徽标
.cross-badge{
    position: absolute;
    right: -3px;
    top: 0;
    border: none;
}
// 提示文字
.small-title{
    font-size: 10px;
    color: gray;
}
</style>
