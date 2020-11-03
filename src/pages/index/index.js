import Vue from 'vue'
import router from './router/index.js'
import store from './store/index.js'
import App from './index.vue'
import entryConfig from "@util/entryConfig"

entryConfig(Vue)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

