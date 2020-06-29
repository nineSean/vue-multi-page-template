import Vue from 'vue'
import App from './index.vue'
import entryConfig from "@util/entryConfig"

entryConfig(Vue)

new Vue({
  render: h => h(App)
}).$mount('#app')

