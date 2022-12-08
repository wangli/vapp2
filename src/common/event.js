const events = {};

export default class event {
   constructor() {}
   // 添加事件
   on(_type, fn, context = this) {
      if (!events[_type]) {
         events[_type] = []
      }
      // 添加事件类型名称，字符串类型，
      events[_type].push([fn, context])
   }
   // 一次事件
   once(type, fn, context = this) {
      function magic() {
         this.off(type, magic)
         fn.apply(context, arguments)
      }
      // 将方法附加在magic方法中，并添加到事假内，当广播事件后删除方法
      magic.fn = fn
      this.on(type, magic)
   }
   // 删除事件
   off(type, fn) {
      let _events = events[type]
      if (!_events) {
         return
      }

      let count = _events.length
      while (count--) {
         if (_events[count][0] === fn || (_events[count][0] && _events[count][0].fn === fn)) {
            _events[count][0] = undefined
         }
      }
   }
   // 广播事件
   emit(type) {
      if (typeof events[type] == 'undefined') return;

      let _events = [...events[type]];
      for (let _event of _events) {
         let [fn, context] = _event;
         if (fn) {
            fn.apply(context, [].slice.call(arguments, 1))
         }
      }
   }
}