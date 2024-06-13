import LocalStore from './localStore'
import EXP from './localStore/explain'
import { system } from '../config'
import { event } from '../common'
import { initBind, bindData, unBindData } from './bindData'
/**
 * 数据共享模块，主要通过localStorage共享
 */
let localStore = null
let indexedDBStroe = null
let indexedDBFunc = null
/**
 * 需要附加的数据字段，适用于简单，无响应处理的数据内容
 * 普通单个字段数据可以定义在_localData数组中，并通过（db.字段名）修改数据
 * 使用localStore.defineObject创建的数据对象是深度响应的，对象内的任何属性值更新，本地的数据也将更新。
 */
let _localData = []
let _fillDeepData = {}
// 数据对象
const db = {
   // 清除数据，可以是数据字段的字符串，也可以是字符串数组；当值是true时表示清除所有；
   clear(name) {
      localStore && localStore.remove(name)
      unBindData(name)
   },
   /**
    * 创建深度相应的数据对象
    * @param {*} name 数据对象属性
    * @param {*} data 数据值
    * @param {boolean} bind 是否绑定值变化（数据值必须是reactive对象）
    */
   addDeep(name, data, bind = false) {
      if (this[name]) {
         throw '当前[' + name + ']已存在';
      } else if (localStore) {
         Object.defineProperty(this, name, {
            set: function (newValue) {
               localStore.defineObject(name, newValue)
            },
            get: function () {
               return localStore.defineObject(name, EXP)
            }
         })
         if (data && !localStore.isset(name)) {
            localStore.defineObject(name, data)
         }
         bind && bindData(name, data)
      } else {
         if (!_fillDeepData[name]) {
            _fillDeepData[name] = { name, data, bind }
         }
      }
   },
   // 响应变化钩子方法
   dataChange(name, data) {
      event.emit('data-change', { name, data })
   },
   /**
    * 创建基本的存储值
    * @param {Array} items 
    */
   setItems(items) {
      _localData = items
      localStore && localStore.defineProperties(this, _localData)
   },
   /**
    * 返回注入的其他数据对象
    */
   setIndexedDB(val, func) {
      indexedDBStroe = val
      indexedDBFunc = func
   },
   // 处理数据
   ihandle(func, options) {
      if (indexedDBStroe && typeof func == 'function') {
         return func.call(indexedDBStroe, options)
      } else {
         console.warn('缺少indexedDB')
         return false
      }
   },
   // 处理数据表
   ihandleTable(action, options) {
      if (indexedDBStroe && typeof indexedDBFunc == 'function') {
         return indexedDBFunc.call(indexedDBStroe, action, options)
      } else {
         console.warn('缺少indexedDB')
         return false
      }
   }
}
export const createLocalStore = function () {
   if (!localStore) {
      localStore = new LocalStore(system.name + '_')
      initBind(localStore)
      // 响应事件
      localStore.dataChange = function (name, data) {
         db.dataChange(name, data)
      }
      let names = Object.keys(_fillDeepData)
      if (names.length > 0) {
         names.forEach(name => {
            let val = _fillDeepData[name]
            db.addDeep(val.name, val.data, val.bind)
            delete _fillDeepData[name]
         })
      }
   }
   return localStore
}
export default db;