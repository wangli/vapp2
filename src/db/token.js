import { ref } from 'vue'
import { system, network } from '../config'
import { event } from '../common'

// 用户当前路由地址最长保持时间
let keeptime = 3600
let keepSession = false

class Token {
   constructor(name) {
      this.name = name || ''
      this.isAuth = ref(false)
   }
   get key() {
      return system.name + "_" + network.authKey + this.name
   }
   /**
    * 保存token时长
    */
   set keeptime(val) {
      keeptime = val
   }
   get keeptime() {
      return keeptime
   }
   /**
    * session保存
    */
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
   }
   get keepSession() {
      return keepSession
   }
   // 值
   set value(val) {
      if (keepSession) {
         sessionStorage.setItem(this.key, val)
      } else {
         localStorage.setItem(this.key, val)
      }
      this.isAuth.value = val ? true : false
      event.emit('token-change', val)
   }
   get value() {
      if (keepSession) {
         return sessionStorage.getItem(this.key)
      } else {
         return localStorage.getItem(this.key)
      }
   }
   /**
    * 验证令牌是否作业
    */
   verify() {
      this.isAuth.value = this.value ? true : false
   }
   /**
    * 清空
    */
   clear() {
      localStorage.removeItem(this.key)
      sessionStorage.removeItem(this.key)
      this.isAuth.value = false
      event.emit('token-change', '')
   }
}

// 正式令牌
export const token = new Token()
if (token.value) {
   token.isAuth.value = true
}
// 刷新令牌
export const refreshToken = new Token('_refresh')
if (refreshToken.value) {
   refreshToken.isAuth.value = true
}
// 默认
export default token