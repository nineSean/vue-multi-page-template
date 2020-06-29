const path = require('path')
const {setPages} = require("./build/utils")
const baseUrl = process.env.BASE_URL
console.log('pages', setPages())

const resolve = directory => path.join(__dirname, directory)

module.exports = {
  pages: setPages(),
  configureWebpack: config => {
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