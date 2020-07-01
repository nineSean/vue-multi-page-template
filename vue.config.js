const path = require('path')
const {setPages} = require("./build/utils")
const apiMocker = require('mocker-api')
const baseUrl = process.env.BASE_URL
const nodeEnv = process.env.NODE_ENV
// console.log('pages', setPages())

const resolve = (...directorys) => path.join(__dirname, ...directorys)

module.exports = {
  publicPath: baseUrl,
  outputDir: 'dist',
  pages: setPages(),
  configureWebpack: config => {
    if (nodeEnv === 'development') config.devtool = 'source-map'
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@comp', resolve('src/components'))
      .set('@util', resolve('src/utils'))
      .set('@mock', resolve('mock'))
    config.plugin('define')
      .tap(options => {
        options[0]['process.env'].MOCK = process.env.MOCK && JSON.parse(process.env.MOCK)
        return options
      })
    config.optimization.minimizer('terser')
      .tap(options => {
        options[0].terserOptions.compress.drop_console = true
        return options
      })
  },
  devServer: {
    historyApiFallback: {
      rewrites: [
        {from: new RegExp(baseUrl + 'index'), to: baseUrl + 'index.html'},
        {from: new RegExp(baseUrl + 'about'), to: baseUrl + 'about.html'},
      ]
    },
    before(app) {
      if (process.env.MOCK) {
        apiMocker(app, resolve('mock/index.js'))
      }
    },
  }
}