const path = require('path')
const glob = require('glob')
const merge = require('webpack-merge')
const pagePath = path.resolve(__dirname, '../src/pages')
exports.setPages = configs => {
  const entryFiles = glob.sync(pagePath + '/*/*.js')
  let result = entryFiles.reduce((accumulator, filePath) => {
    const filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    const tmp = filePath.substring(0, filePath.lastIndexOf('.'))
    let conf = {
      // page 的入口
      entry: filePath,
      // 模板来源
      template: tmp + '.html',
      // 在 dist/***.html 的输出
      filename: filename + '.html',
      // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
      chunks: ['manifest', 'vendor', filename],
      // 已在模板中手动插入js、css资源，则inject设置为false避免自动插入
      inject: false,
    }
    if (process.env.NODE_ENV === 'production') {
      conf = merge(conf, {
        minify: {
          removeComments: true, // 删除html中的注释代码
          collapseWhitespace: true, // 删除html中的空白符
        },
        chunksSortMode: 'manual'// 按manual的顺序引入
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