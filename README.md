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
- [ ] 请求封装
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
│           ├── assets                # about 页面静态资源（如果有的话）
│           ├── router                # about 页面路由（如果有的话）
│           ├── store                 # about 页面 vuex（如果有的话）
│           ├── about.html            # about 页面模板
│           ├── about.js              # about 页面入口文件
│           └── about.vue             # about 页面根组件
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
