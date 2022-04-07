// 封装专门处理时间的方法
// 引入时间第三方库
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // 到指定时间需要的插件
import 'dayjs/locale/zh'
// @param{*}之前的时间，我要传递的参数
// @returns系统时间到指定时间的距离
export const timeAgo = (targetTime) => {
  // 格式化时间
  dayjs.extend(relativeTime)
  dayjs.locale('zh')
  var a = dayjs()
  var b = dayjs(targetTime)
  return a.to(b)// 返回多久之前
}
