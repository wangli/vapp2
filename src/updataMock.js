// 模拟数据信息
const mockData = {}

export default {
   //    设置数据
   setData(data) {
      Object.assign(mockData, data)
   },
   //    返回数据
   getData(apiname, reqData) {
      let res = null
      if (apiname && mockData[apiname]) {
         res = mockData[apiname]
      } else if (reqData.url && mockData[reqData.url]) {
         res = mockData[reqData.url]
      } else {
         return null
      }
      if (res && typeof res == 'function') {
         return res(reqData)
      } else {
         return res
      }
   }
}