import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const createRouter = () => new VueRouter({
  mode: 'hash', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: () => import('../views/Home/index')
    },
    {
      path: '/index/result',
      component: () => import('../views/Home/SearchResult')
    }
  ]
})

const router = createRouter()

export default router
