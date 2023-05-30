import intersection from 'lodash/intersection'
import Request from "./utils/request"
import { state, network } from './config'
import token from './db/token'
import cmd from './cmd'
import { reactive } from 'vue'
import updataMock from './updataMock'

// 拦截处理方法
let interceptorItemsReq = []
let interceptorItemsRes = []
const cmdMessage = function (content, type = 'warning') {
   cmd.execute('message', content, type)
}
const updata = {
   // 请求中的接口
   PendingItems: reactive([]),
   /**
    * 请求数据
    * @param {object} reqData 
    * @param {string} apiname 
    * @returns 
    */
   send: async function (value, apiname) {
      let reqData = null
      let reject = null
      if (value instanceof Promise) {
         try {
            reqData = await value
         } catch (error) {
            throw new Error(error)
         }
      } else if (value instanceof Function) {
         reqData = value()
      } else if (value && typeof value == 'object' && typeof value != 'function' && !Array.isArray(value)) {
         reqData = value
      } else {
         throw new Error('无请求对象')
      }
      if (!reqData) {
         throw new Error('无效的请求')
      }

      if (typeof reqData.url != 'string') {
         throw new Error('接口地址无效')
      }
      let pending = []
      if (!updata.PendingItems.includes(apiname)) {
         pending.push(apiname)
      }
      if (!updata.PendingItems.includes(reqData.url)) {
         pending.push(reqData.url)
      }
      updata.PendingItems.push(...pending)

      // 发送拦截处理
      interceptorItemsReq.forEach(handle => {
         reqData = handle(reqData, apiname)
      })
      // 请求数据模拟返回
      if (network.mock) {
         let mockData = updataMock.getData(apiname, reqData)
         if (mockData) {
            removePendingItems(apiname)
            removePendingItems(reqData.url)
            // 获取数据拦截处理
            interceptorItemsRes.forEach(handle => {
               mockData = handle(mockData, apiname)
            })
            return mockData
         }
      }
      try {
         let resData = await Request(reqData, network)
         removePendingItems(apiname)
         removePendingItems(reqData.url)
         let data = resData
         // 获取数据拦截处理
         interceptorItemsRes.forEach(handle => {
            data = handle(data, apiname)
         })
         if (data instanceof Function) {
            return data.call(null, apiname)
         } else if (data instanceof Promise) {
            try {
               return await data
            } catch (error) {
               throw new Error(error)
            }
         } else {
            // 获取code
            let code = typeof data.code != 'undefined' ? data.code : -1
            if (code == state.code.ok) {
               return data
            } else if (code == state.code.token) {
               cmdMessage(data.message, 'warning')
               token.clear()
            } else if (code == state.code.error) {
               cmdMessage(data.message, 'error')
            } else {
               if (typeof state.code.reject == 'number' && code > state.code.reject) {
                  reject = data
                  throw new Error('操作无效')
               } else {
                  cmdMessage(data.message, 'warning')
               }
            }
         }

      } catch (error) {
         removePendingItems(apiname)
         removePendingItems(reqData.url)
         if (reject) {
            throw new Error(reject.message || error.message)
         } else if (reqData.fully) {
            throw new Error(error)
         }
      }
   },
   /**
    * 扩展updata请求对象
    * @param {*} obj 
    */
   assign(obj) {
      if (obj instanceof Array) {
         obj.forEach(element => {
            _assign(element)
         });
      } else if (obj instanceof Object) {
         _assign(obj)
      }
   },
   /**
    * 添加数据发送拦截处理
    * @param {*} fun 
    */
   addReq(fun) {
      if (typeof fun == 'function' && !interceptorItemsReq.find(n => n != fun)) {
         interceptorItemsReq.push(fun)
      }
   },
   /**
    * 添加数据返回拦截处理
    * @param {*} fun 
    */
   addRes(fun) {
      if (typeof fun == 'function' && !interceptorItemsRes.find(n => n != fun)) {
         interceptorItemsRes.push(fun)
      }
   },
   /**
    * 配置mock数据
    * @param {*} data 
    */
   setMock(data) {
      updataMock.setData(data)
   }
}

const removePendingItems = function (value) {
   let index = updata.PendingItems.findIndex(item => item == value)
   if (index > -1) {
      updata.PendingItems.splice(index, 1)
   }
}
const _assign = function (obj) {
   let Mkeys = Object.keys(updata);
   let Okeys = Object.keys(obj);
   let keys = intersection(Mkeys, Okeys);
   if (keys.length > 0) {
      throw '存在相同的接口请求方法' + JSON.stringify(keys);
   } else {
      for (let key of Okeys) {
         Object.assign(updata, {
            [key]() {
               return updata.send(obj[key](...arguments), key)
            }
         })
      }
   }
}

export default updata