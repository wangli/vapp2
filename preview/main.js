import { h, resolveComponent } from 'vue'
import { create } from '../src'
import demo from './demo.vue'

// 我是页面A
const pageA = { name: 'page_a', render: () => h('a', { href: '#/b' }, '我是页面A') }
// 我是页面B
const pageB = { name: 'page_b', render: () => h('a', { href: '#/demo' }, '我是页面B') }
// 我是路由配置
const pages = [
   { path: '/', name: 'pageA', component: pageA },
   { path: '/b', name: 'pageB', component: pageB },
   { path: '/demo', name: 'demo', component: demo }
]
// 创建一个最简单的应用
const app=create('#app', {
   config:{
      system:{
         name:'myapp'
      }
   },
   frame:{
      name: 'main_page',
      setup() {
         return () => h(resolveComponent('router-view'))
      }
   },
   pages
})