const actions = {}

const cmd = {
   // 添加命令
   add(name, action) {
      if (!actions[name]) {
         actions[name] = action
      } else {
         console.warn(name, '命令已存在')
      }
   },
   // 删除命令
   del(name) {
      if (Array.isArray(name)) {
         name.forEach(key => {
            this.del(key)
         });
      } else if (typeof name == 'string' && actions[name]) {
         delete actions[name]
      }
   },
   clear() {
      for (const key in actions) {
         if (Object.hasOwnProperty.call(actions, key)) {
            delete actions[key]
         }
      }
   },
   // 获取命令
   getAction(name) {
      return actions[name]
   },
   // 执行命令
   execute(name) {
      if (actions[name] && typeof actions[name] == 'function') {
         actions[name].apply(actions, [].slice.call(arguments, 1));
      } else {
         console.error(`当前命令[ ${name} ]无效`)
      }
   }
}
// 封闭对象
Object.seal(cmd)
export default cmd