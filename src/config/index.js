import { ref } from 'vue'
import * as Navs from './navs'

export const system = {
   //    系统标识（英文字母）
   name: 'wapp',
   //   系统名称
   title: '',
   //   版权信息
   copyright: ''
}

export const network = {
   host: '',
   authKey: 'Authorization',
   responseType: 'json',
   method: 'POST',
   mock: false,
   get systemName() {
      return system.name
   }
}

export const state = {
   code: {
      //    成功
      ok: 2000,
      //   找不到
      nothing: 404,
      //   令牌失效
      token: 1000,
      //    错误
      error: 'error',
      // 放行
      reject: null
   },
   status: {}
}
// 可配置的内部页面
export const pages = {}
// 导航菜单信息
export const navs = Navs
// 权限信息
export const authority = ref([])
// 框架页面
export const frame = {
   //   默认未登录组件
   login: 'app_login',
   //    默认主页面组件
   main: 'app_main',
}
// 样式主题
export const style = {
   theme: 'default',
   customize: {}
}
// 设置导航菜单
export const setNavs = Navs.init
// 初始化配置
export const init = function (config) {
   if (config) {
      config.system && Object.assign(system, config.system)
      config.network && Object.assign(network, config.network)
      config.state && Object.assign(state, config.state)
      config.frame && Object.assign(frame, config.frame)
      config.style && Object.assign(style, config.style)
      config.navs && Navs.init(config.navs, config.navsOptions)
      config.authority && (authority.value = config.authority)
   }
   return {
      system,
      network,
      state,
      frame,
      style,
      navs
   }
}