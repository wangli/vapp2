/**
 * 获取服务端api接口数据
 */

import { network } from '../config'
import { jsonToParams } from './index'
import token from '../db/token'

let responseType = 'json'
let authKey = 'Authorization'
export default function (_obj) {
   authKey = network.authKey || 'Authorization'
   responseType = _obj.responseType ? _obj.responseType : network.responseType || 'json'
   // 地址
   let url = /^(?!https?:\/\/)/.test(_obj.url) ? network.host + _obj.url : _obj.url
   // 令牌
   let mytoken = token.value ? token.value.replace(/\"/g, '') : ''
   let authorization = mytoken ? {
      [authKey]: mytoken
   } : {};
   // 完全自定义覆盖
   let customize = _obj.customize || {}
   // 头部信息
   let headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
   }
   // 如果 headers为'','null',false删除默认配置
   if (!network.headers || (typeof network.headers == 'string' && (network.headers == '' || network.headers == 'null'))) {
      headers = {}
   } else {
      Object.assign(headers, network.headers)
   }
   // 请求对象
   let obj = Object.assign({
      method: _obj.method || network.method,
      mode: network.mode || 'cors',
      headers: new Headers(Object.assign(headers, authorization, _obj.headers))
   }, customize)
   if (obj.method && obj.method.toUpperCase() == "POST") {
      let contentType = obj.headers.get('Content-Type')
      if (contentType == 'application/json') {
         obj.body = JSON.stringify(_obj.data)
      } else if (contentType == 'multipart/form-data' || contentType == false) {
         const formData = new FormData();
         for (let key in _obj.data) {
            formData.append(key, _obj.data[key])
         };
         obj.headers.delete('Content-Type')
         obj.body = formData
      } else {
         obj.body = _obj.data
      }
   } else {
      url = /\?/.test(url) ? url + "&" + jsonToParams(_obj.data) : url + "?" + jsonToParams(_obj.data)
   }
   //    请求数据
   return new Promise((resolve, reject) => {
      fetch(url, obj).then(response => {
         if (response.ok) {
            if (responseType) {
               return response[responseType]()
            } else {
               return response.json()
            }
         } else {
            reject(response)
         }
      }, reject).then(resolve);
   })
}