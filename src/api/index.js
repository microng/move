// 统一封装接口方法，每个方法负责请求一个url地址
// 逻辑页面，导入这个接口方法，好处 请求url路径 ，可以在这里统一管理
import axios from '@/utils/request.js'
import { getStorage } from '@/utils/Storage'
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

// 更新用户添加后的频道
export const updataUserChannelAPI = ({ channels }) => axios({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data: {
    channels
  }
})
// 删除用户频道
export const deletUserChannelAPI = ({ channelId }) => axios({
  url: `/v1_0/user/channels/${channelId}`,
  method: 'DELETE'
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
// 获取文章详情
export const articdetailAPI = ({ articId }) => axios({
  url: `/v1_0/articles/${articId}`
})
// 实现对搜索进行建议
export const suggestAPI = ({ keyword }) => axios({
  url: '/v1_0/suggestion',
  params: {
    q: keyword
  }
})
// 获取搜索的结果
export const suggestResultAPI = ({ page = 1, per_page = 10, q }) => axios({
  url: '/v1_0/search',
  method: 'GET',
  params: {
    page,
    per_page,
    q
  }
})
// 关注用户
export const userfollwAPI = ({ userId }) => axios({
  url: '/v1_0/user/followings',
  method: 'POST',
  data: {
    target: userId
  }
})
// 取消关注用户
export const unuserfollwAPI = ({ userId }) => axios({
  url: `/v1_0/user/followings/${userId}`,
  method: 'DELETE'
})
// 给文章点赞
export const likeartAPI = ({ artId }) => axios({
  url: '/v1_0/article/likings',
  method: 'POST',
  data: {
    target: artId
  }
})
// 给文章取消点赞
export const unlikeartAPI = ({ artId }) => axios({
  url: `/v1_0/article/likings/${artId}`,
  method: 'DELETE'
})
// 获取文章评论
export const getcommentsAPI = ({ id, offset, limit = 10 }) => axios({
  url: '/v1_0/comments',
  params: {
    type: 'a',
    source: id,
    offset,
    limit
  }
})
// 对文章发布评论
export const sendcommentAPI = ({ id, content, art_id = null }) => {
  const obj = {
    target: id,
    content
  }
  if (art_id !== null) { // 就是有三个参数，是对评论进行回复
    obj.art_id = art_id
  }
  return axios({
    url: '/v1_0/comments',
    method: 'POST',
    data: obj
  })
}
// 取消对评论的喜欢
export const unlikeAIP = ({ commentId }) => axios({
  url: `/v1_0/comment/likings/${commentId}`,
  method: 'DELETE'
})
// 对评论进行喜欢
export const likeAPI = ({ id }) => axios({
  url: '/v1_0/comment/likings',
  method: 'POST',
  data: {
    target: id
  }
})
// 获取用户的个人信息
export const userAPI = () => axios({
  url: '/v1_0/user'
})
// 在编辑页面获取个人信息
export const userallAPI = () => axios({
  url: '/v1_0/user/profile'
})
// 编辑用户头像
export const userphotoAPI = (dt) => axios({
  url: '/v1_0/user/photo',
  method: 'PATCH',
  data: dt
})
// 更新个人用户信息
export const usermesAPI = (dataObj) => {
  const obj = {
    name: '',
    gender: '',
    birthday: '',
    intro: ''
  }
  for (const prop in obj) { // 遍历参数对象里每个key
    if (dataObj[prop] === undefined) { // 用key去外面传入的参数对象匹配，如果没有找到就证明没有传
      delete obj[prop]// 用obj身上移除
    } else {
      obj[prop] = dataObj[prop]
    }
  }
  return axios({ url: '/v1_0/user/profile',
    method: 'PATCH',
    data: obj })
}
// 刷新token
export const getNewTokenAPI = () => axios({
  url: '/v1_0/authorizations',
  method: 'PUT',
  headers: {
    Authorization: 'Bearer ' + getStorage('refresh_token')
  }
})
