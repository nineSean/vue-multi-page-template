const path = require('path')
const glob = require('glob')
const merge = require('webpack-merge')
const pagePath = path.resolve(__dirname, '../src/pages')
exports.setPages = configs => {
  const entryFiles = glob.sync(pagePath + '/*/*.js')
  const result = entryFiles.reduce((accumulator, filePath) => {
    const filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    const tmp = filePath.substring(0, filePath.lastIndexOf('.'))
    let conf = {
      // page 的入口
      entry: filePath,
      // 模板来源
      template: tmp + '.html',
      // 在 dist/***.html 的输出
      filename: filename + '.html',
      // 页面模板需要加对应的 js 脚本，如果不加这行则每个页面都会引入所有的 js 脚本
      // chunks: ['manifest', 'vendor', filename],
      chunks: ['chunk-vendors', 'chunk-common', filename],
      // 已在模板中手动插入 js 、css 资源，则 inject 设置为 false 避免自动插入
      inject: false,
      isMobile: process.env.MOBILE && JSON.parse(process.env.MOBILE)
    }
    if (process.env.NODE_ENV === 'production') {
      conf = merge(conf, {
        minify: {
          removeComments: true, // 删除 html 中的注释代码
          collapseWhitespace: true, // 删除 html 中的空白符
        },
        chunksSortMode: 'manual'// 按 manual 的顺序引入
      })
    }
    if (configs && Object.prototype.toString.call(configs) === '[object Object]') {
      conf = merge(conf, configs)
    }
    accumulator[filename] = conf
    return accumulator
  }, {})
  return result
}
