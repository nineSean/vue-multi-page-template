import Vue from 'vue'
import router from './router/index.js'
import App from './index.vue'
import entryConfig from "@util/entryConfig"

entryConfig(Vue)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

