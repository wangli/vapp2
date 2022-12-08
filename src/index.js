import { createApp } from 'vue'
import Appcontent from './appcontent'
import { default as Db, createLocalStore } from './db'
import Token from './db/token'
import Pages from './pages'
import Updata from './updata'
import * as myConfig from './config'
import * as V from './v'
import { event as myEvent } from './common'
import CMD from './cmd'
import { addFrame } from './frame'
import './css.less'

let app = null
let pluginItems = []

// 注册一个消息发送的命令
CMD.add('message', (value, type = 'info', options = {}) => {
   myEvent.emit('message', value, type, options)
})
/**
 * 安装插件
 * @param {*} install 
 * @returns 
 */
const use = function (install) {
   if (app) {
      if (install instanceof Function) {
         // 单个函数插件
         install(app)
      } else if (install && typeof install == 'object' && install.install && install.install instanceof Function) {
         // 直接原有插件方法
         app.use(install)
      } else if (Array.isArray(install)) {
         // 数组处理
         install.forEach(element => {
            use(element)
         });
      }
   }
}


/**
 * 配置页面
 * 来自vue-router
 * @param {array} items 
 */
const router = function (items, options) {
   // 页面路由
   if (app) {
      app.use(Pages.create(items, options))
   }
}

/**
 * 创建一个vue应用
 * @param {*} dom 
 * @param {object} options 
 * @returns 
 */
export const create = function (dom, options = {}) {
   // 基本配置信息
   options.config && myConfig.init(options.config)
   // 创建存储配置
   createLocalStore()
   // 本地存储数据初始化
   if (options.data && options.data.localStore) {
      if (Array.isArray(options.data.localStore)) {
         Db.setItems(options.data.localStore)
      } else {
         Db.setItems([options.data.localStore])
      }
   }
   // 页面框架配置
   options.frame && addFrame(options.frame)
   // options.frame && useframe(options.frame)
   // 创建应用
   app = createApp(Appcontent)
   // 安装插件
   options.plugin && (pluginItems = options.plugin)
   if (Array.isArray(pluginItems)) {
      pluginItems.forEach(plugin => {
         use(plugin)
      })
   } else {
      use(pluginItems)
   }
   // 页面配置
   options.pages && router(options.pages, options.rOptions)
   // 显示到页面中
   app.mount(dom)
   return app
}
// token数据
export const token = Token
//接口数据请求
export const updata = Updata
// 本地数据处理
export const db = Db
// 事件对象
export const event = myEvent
// 配置项
export const config = myConfig
// 页面路由
export const pages = Pages
// 命令入口
export const cmd = CMD
// 内置的一些常用方法
export const v = V


if (typeof window != 'undefined') {
   window.A = {
      updata,
      db,
      get app() {
         return app
      },
      get router() {
         return router
      }
   }
}