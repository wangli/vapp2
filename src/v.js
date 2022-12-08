export { interval, timeout, jsonData, jsonToParams, removeArray, getUrlParam } from './utils'

const loadingList = []
const timeout = 10000
export const setLoading = function (load, value = true) {
   if (load && load instanceof Object && typeof load.value != 'undefined') {
      load.value = value
      let index = loadingList.findIndex(item => {
         return item.load == load
      })
      if (index > -1) {
         clearTimeout(loadingList[index].it)
         loadingList.splice(index, 1)
      }
      if (value) {
         let it = setTimeout(() => {
            let i = loadingList.findIndex(item => {
               return item.load == load
            })
            if (i > -1) {
               loadingList[i].load.value = false
               loadingList.splice(i, 1)
            }
         }, timeout)
         loadingList.push({
            it,
            load
         })
      }
   }
}