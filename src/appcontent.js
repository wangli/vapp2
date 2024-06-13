import { h, onMounted, isVNode } from 'vue'
import { event } from './common'
import { isAuth } from './authority'
import { frame as frameConfig } from './config'
import getFrame from './frame'

let style = {
   position: 'absolute',
   width: "100%",
   height: "100%",
   top: 0,
   left: 0,
   transformOrigin: "0 0",
   zIndex: 0
}
export default {
   name: 'app',
   setup() {
      const frame = getFrame()
      event.emit('app-created', frameConfig)

      onMounted(() => {
         event.emit('app-mounted', frameConfig)
      })

      return () => {
         let containerList = []
         if (frameConfig.login && frame[frameConfig.login]) {
            // 存在登录页面
            if (isAuth.value) {
               // 主页
               containerList.push(h(frame[frameConfig.main], {}, ""))
            } else {
               // 登录页
               containerList.push(h(frame[frameConfig.login], {}, ""))
            }
         } else if (frameConfig.main && frame[frameConfig.main]) {
            // 只有主页
            containerList.push(h(frame[frameConfig.main], {}, ""))
         } else if ((typeof frame == 'object' && frame.name) || typeof frame == 'function') {
            // 无登录页面
            if (isVNode(frame)) {
               containerList.push(frame)
            } else {
               containerList.push(h(frame, {}, ""))
            }
         } else {
            console.warn('没有对应的frame页面')
         }
         if (Array.isArray(frame.global)) {
            frame.global.forEach(element => {
               containerList.push(h(element))
            })
         } else if (frame.global) {
            if (isVNode(frame.global)) {
               containerList.push(frame.global)
            } else {
               containerList.push(h(frame.global))
            }
         }

         return h('div', { id: "appcontent", style }, containerList)
      }
   }
}