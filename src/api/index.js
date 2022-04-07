// 统一封装接口方法，每个方法负责请求一个url地址
// 逻辑页面，导入这个接口方法，好处 请求url路径 ，可以在这里统一管理
import axios from '@/utils/request.js'
// 登录的接口
export const loginAPI = ({ mobile, code }) => axios({
  url: '/v1_0/authorizations',
  method: 'POST',
  data: {
    mobile,
    code
  }
})

// 获取频道请求方法
export const getAllChannelsAPI = () => axios({
  url: '/v1_0/channels',
  method: 'GET'
})

// 此文件是对axios请求进行封装

// 获取用户选择的频道。如果用户没有选择会默认返回系统设置的频道
export const getUserChannelsAPI = () => axios({
  url: '/v1_0/user/channels'
})

// 获取文章列表
export const getArticlesAPI = ({ channel_id, timestamp }) => axios({
  url: '/v1_0/articles',
  params: {
    channel_id,
    timestamp
  }

})
// 实现文章的不感兴趣
export const dislikeArticleAPI = ({ artId }) => axios({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  data: {
    target: artId
  }
})
// 实现对文章进行举报
export const articReportAPI = ({ artId, type }) => axios({
  url: '/v1_0/article/reports',
  method: 'POST',
  data: {
    target: artId,
    type: type,
    remark: '这里本应该是其他问题的说明，但是没有设置就写死'
  }
})
