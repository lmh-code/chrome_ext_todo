import Vue from 'vue'
import App from './App.vue'
import '@/assets/style/common.scss'
import '@/icons/index.js' // icon

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
