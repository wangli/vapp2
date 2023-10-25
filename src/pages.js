import { watch } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { selectMenu, keyName } from './config/navs'
import { system } from './config'
import token from './db/token'


let router = null
let route = null
let before = () => true
let after = () => true
const beginTime = {
   get value() {
      if (localStorage.getItem(system.name + "_" + 'pageBeginTime')) {
         return parseInt(localStorage.getItem(system.name + "_" + 'pageBeginTime'))
      } else {
         return new Date().getTime()
      }
   },
   set value(val) {
      localStorage.setItem(system.name + "_" + 'pageBeginTime', val)
   },
   clear() {
      localStorage.removeItem(system.name + "_" + 'pageBeginTime')
   }
}

const create = function (pages, options = {}) {
   if (Array.isArray(pages)) {
      let myOptions = Object.assign({
         history: createWebHashHistory(),
         routes: pages,
      }, options)
      router = createRouter(myOptions)
      router.afterEach((to, from) => {
         if (after(to, from)) {
            if ((new Date().getTime() - beginTime.value) > token.keeptime * 1000) {
               token.clear()
               beginTime.clear()
            } else {
               beginTime.value = new Date().getTime()
            }
         }
      })
      router.beforeEach((to, from, next) => {
         let page = before(to, from)
         if (page === true) {
            next()
         } else if (page !== false) {
            return next(page)
         } else {
            return page
         }
      })
      route = router.currentRoute
      watchRoute()
      return router
   } else {
      console.error('pages配置失败')
      return null
   }
}
const watchRoute = function () {
   watch(route, newRoute => {
      if (newRoute.name) {
         selectMenu(newRoute.name)
      }
   }, {
      immediate: true
   })
}
export default {
   create,
   get router() {
      return router
   },
   get route() {
      return route
   },
   push(to) {
      if (before(to)) {
         router && router.push(to)
      }
   },
   replace(to) {
      if (before(to)) {
         router && router.replace(to)
      }
   },
   go(value, replace = false) {
      if (!before(value)) return false
      if (router) {
         if (typeof value == 'number') {
            return router.go(value)
         }
         let routeVal = ''
         if (typeof value == 'string') {
            if (/^(http:\/\/|https:\/\/)/.test(value)) {
               location.href = value
               return
            } else if (/^\//.test(value)) {
               routeVal = value
            } else {
               routeVal = { name: value }
            }
         } else if (value) {
            routeVal = value
         }
         if (replace) {
            router.replace(routeVal)
         } else {
            router.push(routeVal)
         }
      }
   },
   back() {
      if (!before()) return false
      router && router.back()
   },
   setAfter(fun) {
      typeof fun == 'function' && (after = fun)
   },
   setBefore(fun) {
      typeof fun == 'function' && (before = fun)
   }
}