/**
 * 简单的数据代理管理
 * @param {*} obj 代理的对象
 * @param {*} change 数据更改后的事件方法
 * @param {*} params change方法的需要传递的参数
 */
const createProxy = function (obj, change, params) {
   if ("Proxy" in window) {
      let keys = Object.keys(obj);
      if (keys.length > 0) {
         for (let key of keys) {
            if (typeof obj[key] == 'object' && obj[key] instanceof Object) {
               obj[key] = createProxy(obj[key], change, params)
            }
         }
      }
      return new Proxy(obj, {
         get: function (target, key) {
            return target[key];
         },
         set: (target, key, value, receiver) => {
            let success = Reflect.set(target, key, value, receiver)
            if (success) {
               change(params, target, key, value)
            }
            return value;
         }
      });
   } else {
      let keys = Object.keys(obj);
      let _obj = {};
      if (keys.length > 0) {
         for (let key of keys) {
            if (typeof obj[key] == 'object' && obj[key] instanceof Object) {
               Object.defineProperty(_obj, key, {
                  value: createProxy(obj[key], change, params),
                  set(value) {
                     _obj[key] = value
                     change(params, obj, key, value)
                  }
               });
            } else {
               Object.defineProperty(_obj, key, {
                  value: obj[key],
                  set(value) {
                     _obj[key] = value
                     change(params, obj, key, value)
                  }
               });
            }
         }
      }
      return _obj;
   }
}
export default createProxy