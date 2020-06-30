const path = require('path')
const {setPages} = require("./build/utils")
const baseUrl = process.env.BASE_URL
const env = process.env.NODE_ENV
console.log('pages', setPages())

const resolve = (...directorys) => path.join(__dirname, ...directorys)

module.exports = {
  publicPath: baseUrl,
  outputDir: 'dist',
  pages: setPages(),
  configureWebpack: config => {
    if (env === 'development') config.devtool = 'source-map'
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@comp', resolve('src/components'))
      .set('@util', resolve('src/utils'))
  },
  devServer: {
    historyApiFallback: {
      rewrites: [
        {from: new RegExp(baseUrl + 'index'), to: baseUrl + 'index.html'},
        {from: new RegExp(baseUrl + 'about'), to: baseUrl + 'about.html'},
      ]
    }
  }
}