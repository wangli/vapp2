import store from 'store'
import createProxy from '../../common/createProxy'
import EXP from './explain'
/**
 * 本地数据存储，可以通过
 */
var _data = {};
// 更新数据
const saveData = function (dbName) {
   let storeData = store.set(dbName, data[dbName]);
   return storeData;
}
// 初始化一个顶级代理对象
const data = createProxy(_data, function (params, target, dbName, value) {
   return saveData(dbName)
});
// 创建代理对象
const createProxyData = function (dbName, value) {
   let __data = value ? value : store.get(dbName) || {}
   if (typeof __data == 'object' || __data instanceof Object) {
      return createProxy(__data, saveData, dbName);
   } else {
      return __data;
   }
}
export const isset = function (dbName) {
   if (store.get(dbName)) {
      return true
   } else {
      return false
   }
}
export default function (dbName, value) {
   if (data[dbName]) {
      if (value) {
         if (value != EXP) {
            data[dbName] = createProxyData(dbName, value)
         }
      } else {
         data[dbName] = createProxyData(dbName, {})
      }
      return data[dbName]
   } else {
      value = value == EXP ? null : value;
      data[dbName] = createProxyData(dbName, value);
      return data[dbName];
   }
}