import store from 'store'
import { default as proxyLocalData, isset } from './proxyLocalData'
var _data = {};
var _prefix = "";
const saveDatatoLocal = function (name) {
   let _sdb = store.set(_prefix + name, _data[_prefix + name]);
   return _sdb;
}
export default class {
   constructor(prefix) {
      _prefix = prefix;
   }
   set(name, value) {
      store.set(_prefix + name, value)
   }
   get(name) {
      return store.get(_prefix + name)
   }
   remove(name) {
      if (typeof name == 'string') {
         store.remove(_prefix + name)
         if (_data[_prefix + name]) {
            delete _data[_prefix + name]
         }
         this.dataChange(name, null)
      } else if (name === true) {
         store.clearAll()
         this.dataChange(true, null)
         _data = {}
      } else if (name instanceof Array) {
         name.forEach(element => {
            store.remove(_prefix + element)
            if (_data[_prefix + element]) {
               delete _data[_prefix + element]
            }
            this.dataChange(name, null)
         });
      }
   }
   clearAll() {
      store.clearAll()
   }
   // 将定义普通属性的属性绑定在对象上
   defineProperty(obj, dbName) {
      let _this = this;
      _data[_prefix + dbName] = this.get(dbName);
      Object.defineProperty(obj, dbName, {
         set(newValue) {
            _data[_prefix + dbName] = newValue;
            _this.dataChange(dbName, saveDatatoLocal(dbName))
         },
         get() {
            return _data[_prefix + dbName];
         }
      })
   }
   // 将定义普通属性的属性组绑定在对象上
   defineProperties(obj, names) {
      if (typeof names == 'string') {
         this.defineProperty(obj, names)
      } else if (names) {
         for (let val of names) {
            this.defineProperty(obj, val)
         }
      }
   }
   // 绑定数据对象，整个数据对象是响应更新的。
   defineObject(dbName, value) {
      return proxyLocalData(_prefix + dbName, value);
   }
   // 判断是否本地存在
   isset(dbName) {
      return isset(_prefix + dbName)
   }
   // 数据更新响应钩子
   dataChange() {}
}