// 页面框架
const frames = {
   default: null
}

/**
 * 添加框架
 * @param {*} value 
 * @param {*} frame 
 */
export const addFrame = function (value, frame) {

   if (typeof value == 'string' && !frames[value] && frame) {
      frames[value] = frame
   } else if (typeof value == 'object') {
      frames.default = value
   }
}

// 返回框架
export default function (name) {
   if (name && frames[name]) {
      return frames[name]
   } else {
      return frames.default || null
   }
}