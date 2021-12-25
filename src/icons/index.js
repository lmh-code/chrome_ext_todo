import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'// svg component
// 全局注册
Vue.component('svg-icon', SvgIcon)

// 读取指定目录的文件。参数1：目录  参数2：是否遍历子级目录  参数3：定义遍历文件规则
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
