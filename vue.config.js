const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: true,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('api', resolve('src/api'))
      .set('views', resolve('src/views'))
  },
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        modifyVars: {
          // 直接覆盖变量
        //   'nav-bar-background-color': '#007bff',
        //   'nav-bar-text-color': '#fff'
          // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          // -dirname值:是当前文件夹所在的绝对路径
          // 值为:D:\VUE2
          hack: `true; @import "${path.join(__dirname, '/src/styles/cover.less')}";`
        }
      }
    }
  }
}
