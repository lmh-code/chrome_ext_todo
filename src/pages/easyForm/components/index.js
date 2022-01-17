import VueI18n from 'vue-i18n'
import enUS from '../lang/en-US'
import zhCN from '../lang/zh-CN'

import DesignForm from './DesignForm'

const loadLang = function(Vue, lang, locale, i18n) {
  // if (locale) {
  //   locale('en-US', { ...locale('en-US'), ...enUS })
  //   locale('zh-CN', { ...locale('zh-CN'), ...zhCN })
  //   Vue.config.lang = lang
  // } else if (i18n) {
  //   i18n.setLocaleMessage('en-US', { ...i18n.messages['en-US'], ...enUS })
  //   i18n.setLocaleMessage('zh-CN', { ...i18n.messages['zh-CN'], ...zhCN })
  //   i18n.locale = lang
  // } else {
  Vue.use(VueI18n)
  Vue.locale('en-US', { ...Vue.locale('en-US'), ...enUS })
  Vue.locale('zh-CN', { ...Vue.locale('zh-CN'), ...zhCN })
  Vue.config.lang = lang
  // }
}

DesignForm.install = function(Vue, opts = {
  lang: 'zh-CN',
  locale: null,
  i18n: null
}) {
  loadLang(Vue, opts.lang, opts.locale, opts.i18n)
  Vue.component(DesignForm.name, DesignForm)
}

const components = [
  DesignForm
]
const install = function(Vue, opts = {
  lang: 'zh-CN',
  locale: null,
  i18n: null
}) {
  loadLang(Vue, opts.lang, opts.locale, opts.i18n)
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export { // 单独引入时使用
  install,
  DesignForm
}

export default { // 全局引入
  install,
  DesignForm
}
