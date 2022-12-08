// 将一般对象转换为纯json对象
export const jsonData = function (val) {
   if (typeof val == 'string') {
      try {
         return JSON.parse(val)
      } catch (error) {
         return val
      }
   } else if (val) {
      return JSON.parse(JSON.stringify(val))
   } else {
      return {}
   }
}
// 生成唯一序号
export const guid = function () {
   const S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
   }
   return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
}
// 定时器
let ids = {}
export const interval = {
   add(_fun, _time, _id) {
      let time = _time || 1000
      let id = _id || "id_" + new Date().getTime() + "" + Math.floor(Math.random() * 1000);
      if (ids[id]) {
         clearInterval(ids[id])
      }
      ids[id] = setInterval(_fun, time);
      return id;
   },
   del(_id) {
      if (_id) {
         if (ids[_id]) {
            clearInterval(ids[_id])
            delete ids[_id]
         }
      } else {
         for (const key in ids) {
            if (Object.hasOwnProperty.call(ids, key)) {
               clearInterval(ids[key])
            }
         }
         ids = {}
      }
   }
}

// 延时处理
let idos = {}
export const timeout = {
   add(_fun, _time, _id) {
      let time = _time || 1000
      let id = _id || "id_" + new Date().getTime() + "" + Math.floor(Math.random() * 1000);
      if (idos[id]) {
         clearTimeout(idos[id])
      }
      idos[id] = setTimeout(_fun, time);
      return id;
   },
   del(_id) {
      if (_id) {
         if (idos[_id]) {
            clearTimeout(idos[_id])
            delete idos[_id]
         }
      } else {
         for (const key in idos) {
            if (Object.hasOwnProperty.call(idos, key)) {
               clearTimeout(idos[key])
            }
         }
         idos = {}
      }
   }
}

// json转url参数
export const jsonToParams = function (data) {
   return data ? Object.keys(data).map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
   }).join("&") : ''
}

// 删除数组值，根据对象key值删除
export const removeArray = function (array, key, value) {
   if (array && array instanceof Array) {
      let index = key ? array.findIndex(n => n[key] == value) : array.findIndex(n => n == value)
      if (index > -1) array.splice(index, 1)
   }
}
// 获取url参数值
export const getUrlParam = function (name, decode = true) {
   let url = location.href.slice(location.href.lastIndexOf('?'))
   let result = {}
   let reg = /([^?=&#]+)=([^?=&#]+)/g
   url.replace(reg, (n, x, y) => result[x] = decode ? decodeURIComponent(y) : y)
   return name ? result[name] || '' : result
}