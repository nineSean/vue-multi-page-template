# brick-vue-multi-page-template
Vue.js 多页应用模板

## 如何使用

```bash
git clone git@github.com:brick-team/brick-vue-multi-page-template.git ./your-project-name

cd your-project-name

yarn install
// npm install

yarn serve
// npm run serve
```

## 进度

- [x] 多页面配置
- [x] 环境变量
- [x] 通用功能整合
- [x] alias 配置
- [x] 请求封装
- [x] 数据 mock
- [ ] 移动端配置
- [ ] 数据 mock

## 目录结构

```
.
├── README.md
├── vue.config.js                     # vue cli 配置文件
├── .env.development                  # 开发环境变量配置文件
├── .env.production                   # 生产环境变量配置文件
├── .browserslistrc                   # 浏览器兼容配置文件
├── babel.config.js                   # babel 配置文件
├── package.json
.
.
.
├── build                             # build 脚本
├── mock                              # mock 数据配置文件
│   ├── db                            # mock 数据库，一个接口一个配置文件
│   └── index.js                      # 所有接口数据聚合处
├── src                               # Vue.js 核心业务
│   ├── api                           # 接入后端服务的基础 API
│   ├── assets                        # 静态文件
│   ├── components                    # 公共组件
│   ├── services                      # 服务，处理服务端返回的数据
│   ├── utils                         # 通用 utility，directive, mixin 等等
│   └── pages                         # 各个页面
│       ├── index                     # index 页面
│       │   ├── assets                # index 页面静态资源（如果有的话）
│       │   ├── router                # index 页面路由（如果有的话）
│       │   ├── store                 # index 页面 vuex（如果有的话）
│       │   ├── index.html            # index 页面模板
│       │   ├── index.js              # index 页面入口文件
│       │   └── index.vue             # index 页面根组件
│       └── about                     # about 页面
```

## 多页面配置
Vue CLI 底层基于 Webpack 打包构建项目，并且提供了一系列方便操作的接口，可以在 `vue.config.js` 文件中自定义配置。
对于 Webpack 层面多页面配置涉及多入口与多模板配置，Vue CLI 提供了 `pages` 字段即可完成，如下：

```js
// /build/utils.js
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
      // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
      chunks: ['chunk-vendors', 'chunk-common', filename],
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

// /vue.config.js
{
  pages: setPages()
}
```

## 环境变量
Webpack 通过 DefinePlugin 插件将 `process.env` 注入浏览器端，在 Vue CLI 生成的项目中我们只需根据不同的环境在以 `.env` 开头的文件配置不同的变量，[请参考](https://cli.vuejs.org/guide/mode-and-env.html#environment-variables)。比如生产环境的环境变量在 `.env.production` 配置，如下：

```
NODE_ENV=production
BASE_URL=/
```

那么，在浏览器端可以通过 `process.env.NODE_ENV` 获取到配置的环境变量值。由于 `.env` 开头文件对环境变量的配置不够灵活（只能以 `key = value` 的形式设置，无法使用表达式），并且文件修改要重新构建项目才能生效，所以在 `/src/utils/configs/index.js` 文件对环境变量进行配置。

## 通用功能整合
由于多页应用各个多页之间是相对独立，对于一些通用的逻辑（如针对某个环境的逻辑、往Vue或者Vue原型上挂载方法、使用插件等等）的整合到独立模块以便复用，见 `/src/utils/entryConfig.js` 。

## alias 配置
可以使用 Vue CLI 提供的 `chainWebpack` 接口对 Webpack 进行细粒度的配置整合，对于比较长的路径配置别名，如下：

```js
// /vue.config.js
{
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@comp', resolve('src/components'))
      .set('@util', resolve('src/utils'))
  }
}
```

## 请求封装
使用 axios 发送请求，axios 提供了拦截器可以在请求和响应前更优雅的添加逻辑。

如在请求前附上凭证、token或者令牌，时效性校验等等；在响应到最末端的业务处理前过滤有效数据，响应错误弹窗，权限不足弹窗，跳转登录页等等。
设计的请求链路如下:

```
Vue 页面组件 <———— services 层 <———— api 层 <———— this.$request <———— axios <———— XMLHttpRequest
```

从右往左：axios 是基于 XMLHttpRequest 的封装，把 axios 挂载在了每个实例的 $request 上，api 层对每个接口进行封装暴露一个简单的方法用于返回 `promise` ，services 层可能会对多个 api 进行整合拼装成某一个业务需要的数据，设计 services 层的初衷希望把更多 Vue 页面组件上的逻辑分离出来，待实践中总结更多经验。

## 数据 mock
作为前端不用完全依赖后端从而能够并行开发，数据 mock 发挥了至关重要的作用。市面上一大堆介绍 mock 的帖子博文，这里分享自己总结的比较优雅的 mock 方法（最佳实践）：使用 Webpack devServer 的 before 钩子，在 环境变量 `MOCK` 为 `true` 时，借助 `api-mocker` （一个提供优雅 api mock 的库，该库基于 `express`，可以 mock HTTP 的各种方法） 使用 `mockjs` 生成随机数据，代码如下：

```js
// /vue.config.js
{
  devServer: {
    before(app) {
// 可在 package.json 文件中的 script 中的命令设置环境变量，然后通过 dev:mock 命令即可使用 mock 数据，后端接口开发完毕联调时候切换为 dev 即可，这样就优雅的实现了通过命令的方式切换功能，而不用手动改代码了，舒服~~~
// /package.json
// "scripts": {
//  "dev": "vue-cli-service serve",
//  "dev:mock": "MOCK=true vue-cli-service serve",
// }
      if (process.env.MOCK) {
        apiMocker(app, resolve('mock/index.js'))
      }
    },
  }
}

// /mock/index.js
const {demo1, demo2} = require('./db/index.js')

const mockData = {
  'GET /users': demo1,
  'GET /customers': demo2,
}
module.exports = mockData

// /mock/db/index.js
const demo1 = require('./demo1.js')
const demo2 = require('./demo2.js')
module.exports = {
  demo1,
  demo2,
}

```

后续添加接口时候只需在 `/mock/db/` 目录下添加接口文件，`/mock/db/index.js` 中汇总最后在 `/mock/index.js` 中引入配置请求方法与接口即可。结合 `express` 与 `mockjs` 可以自己简单的实现后端逻辑生成随机数据了，请参考 [api mocker](https://github.com/jaywcjlove/mocker-api) 与 [mockjs](http://mockjs.com) ，代码如下：

```js
// /mock/db/demo1
const {Random} = require('mockjs')
module.exports = (req, res) => {
  const data = {
    users: Array
      .from({length: (5 + Math.floor(Math.random() * 5))}, (_, i) => ({id: i}))
      .map(user => {
        user.name = Random.cname()
        return user
      })
  }
  res.json(data)
}
```

这里再提供一个用 axios 响应拦截器实现 mock 数据的思路，在某些情况下可以使用，代码如下：

```js
const mockData = [
  ['/users', {data: [{name: 'sean'}], status: 'success'}]
]

const mockDataMap = new Map(mockData)

axios.interceptors.request.use(config => Promise.reject(config), error => {
  console.log('request error', error)
})

axios.interceptors.response.use(response => response, error => {
  console.log('response error', error)
  // if (process.env.MOCK) {
    return Promise.resolve(mockDataMap.get(error.url))
  // }
})

axios.get('/users').then(data => console.log('data', data))
```








