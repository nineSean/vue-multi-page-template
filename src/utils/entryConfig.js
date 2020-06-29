import Vue from 'vue'
import {goTo,} from './utils'

export default Vue => {
  // 根据需求对各个环境做通用配置
  if (process.env.NODE_ENV !== 'production') {
    Vue.config.performance = true
  }
  Vue.$goTo = Vue.prototype.$goTo = goTo
  Vue.$eventHub = Vue.prototype.$eventHub = new Vue()
}
