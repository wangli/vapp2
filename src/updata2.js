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
   send: function (reqData, apiname) {
      if (typeof reqData.url != 'string') {
         return new Promise((res, rej) => rej('接口地址无效'))
      }
      let pending = []
      if (!updata.PendingItems.includes(apiname)) {
         pending.push(apiname)
      }
      if (!updata.PendingItems.includes(reqData.url)) {
         pending.push(reqData.url)
      }
      updata.PendingItems.push(...pending)

      return new Promise((resolve, reject) => {
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
               resolve(mockData)
               return
            }
         }

         Request(reqData).then(resData => {
            removePendingItems(apiname)
            removePendingItems(reqData.url)
            let data = resData
            // 获取数据拦截处理
            interceptorItemsRes.forEach(handle => {
               data = handle(data, apiname)
            })
            if (typeof data == 'function') {
               resolve(data.call(null, apiname))
            } else if (data) {
               // 获取code
               let code = typeof data.code != 'undefined' ? data.code : -1
               if (code == state.code.ok) {
                  resolve(data)
               } else if (code == state.code.token) {
                  cmdMessage(data.message, 'warning')
                  token.clear()
               } else if (code == state.code.error) {
                  cmdMessage(data.message, 'error')
               } else {
                  if (typeof state.code.reject == 'number' && code > state.code.reject) {
                     reject(data)
                  } else {
                     cmdMessage(data.message, 'warning')
                  }
               }
            }
         }, err => {
            removePendingItems(apiname)
            removePendingItems(reqData.url)
            if (reqData.fully) {
               reject(err)
            }
         });
      })
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