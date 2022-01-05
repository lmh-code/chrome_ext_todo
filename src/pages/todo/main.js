import Vue from 'vue'
import App from './App.vue'
import '@/assets/style/common.scss'
import '@/icons/index.js' // icon
import router from './router/index'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
