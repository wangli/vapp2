import { ref } from 'vue'
import { system, network } from '../config'
import { event } from '../common'

// 用户当前路由地址最长保持时间
let keeptime = 3600
let keepSession = false
const token = {
   get key() {
      return system.name + "_" + network.authKey
   },
   set keeptime(val) {
      keeptime = val
   },
   get keeptime() {
      return keeptime
   },
   set value(val) {
      if (keepSession) {
         sessionStorage.setItem(this.key, val)
      } else {
         localStorage.setItem(this.key, val)
      }
      this.isAuth.value = val ? true : false
      event.emit('token-change', val)
   },
   get value() {
      if (keepSession) {
         return sessionStorage.getItem(this.key)
      } else {
         return localStorage.getItem(this.key)
      }
   },
   set keepSession(val) {
      if (typeof val == 'boolean') {
         if (keepSession = !val) {
            if (keepSession) {
               localStorage.setItem(this.key, sessionStorage.getItem(this.key))
            } else {
               sessionStorage.setItem(this.key, localStorage.getItem(this.key))
            }
         }
         keepSession = val
      }
   },
   get keepSession() {
      return keepSession
   },
   isAuth: ref(false),
   verify() {
      this.isAuth.value = this.value ? true : false
   },
   clear() {
      localStorage.removeItem(this.key)
      sessionStorage.removeItem(this.key)
      this.isAuth.value = false
      event.emit('token-change', '')
   }
}
if (token.value) {
   isAuth.value = true
}

export default token