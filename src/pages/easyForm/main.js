import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

import App from './App.vue'
import '@/assets/style/common.scss'
import '@/icons/index.js' // icon
import router from './router/index'

import DesignForm from './components/index' // 需要注册到全局的组件

Vue.config.productionTip = false

Vue.use(VueI18n)

Vue.config.lang = 'zh-cn'
Vue.locale('zh-cn', zhLocale)
Vue.locale('en', enLocale)

Vue.use(DesignForm)

Vue.use(ElementUI, {
  size: 'small'
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
