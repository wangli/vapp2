/**
 * 获取服务端api接口数据
 */

import { jsonToParams } from './index'

export default function (_obj, _network = {}) {
   let network = Object.assign({
      host: '',
      authKey: 'token',
      responseType: 'json',
      method: 'get',
      mode: 'cors',
      headers: {
         'Access-Control-Allow-Origin': '*',
         'Content-Type': 'application/json'
      }
   }, _network)
   // 保存令牌的名称
   let tokenName = network.systemName ? network.systemName + "_" + network.authKey : network.authKey
   // 地址
   let url = /^(?!https?:\/\/)/.test(_obj.url) ? network.host + _obj.url : _obj.url
   // 令牌
   let authorization = localStorage.getItem(tokenName) ? { 'Authorization': localStorage.getItem(tokenName) } : {}
   // 完全自定义覆盖
   let customize = _obj.customize || {}
   // 头部信息，如果 headers为'','null',false删除默认配置
   if (!network.headers || (typeof network.headers == 'string')) {
      network.headers = {}
   }
   // 请求对象
   let obj = Object.assign({
      method: _obj.method || network.method,
      mode: _obj.mode || network.mode,
      signal: _obj.signal,
      headers: new Headers(Object.assign({}, network.headers, authorization, _obj.headers))
   }, customize)
   if (obj.method.toUpperCase() == "POST") {
      obj.body = (obj.headers.get('Content-Type') == 'application/json') ? JSON.stringify(_obj.data) : _obj.data
   } else {
      url = /\?/.test(url) ? url + "&" + jsonToParams(_obj.data) : url + "?" + jsonToParams(_obj.data)
   }
   //    请求数据
   return new Promise((resolve, reject) => {
      fetch(url, obj).then(response => {
         if (network.responseType) {
            return response[network.responseType]()
         } else {
            return response.json()
         }
      }, reject).then(resolve);
   })
}