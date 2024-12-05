import { h, resolveComponent } from 'vue'
import { create, pages, event } from '../src'
import demo from './demo.vue'
import bbb from './bbb.vue'
import booting from './booting.vue'

// 我是页面A
const pageA = { name: 'page_a', render: () => h('a', { href: '#/b' }, '我是页面A') }
// 我是页面B
const pageB = { name: 'page_b', render: () => h('a', { href: '#/demo' }, '我是页面B') }
// 我是路由配置
const pagesRoute = [
   { path: '/', name: 'pageA', component: pageA },
   { path: '/b', name: 'pageB', component: pageB },
   { path: '/demo', name: 'demo', component: demo }
]

event.on('app-created', async () => {
   await new Promise(res => setTimeout(() => res(), 10000))
   event.emit('app-ready', true)
})
pages.setBefore((to, from) => {
   return true
})
// 创建一个最简单的应用
const app = create('#app', {
   await: true,
   config: {
      system: {
         name: 'myapp'
      }
   },
   frame: {
      app_main: {
         name: 'main_page',
         setup() {
            return () => h(resolveComponent('router-view'))
         }
      },
      global: [bbb],
      booting
   },
   pages: pagesRoute
})