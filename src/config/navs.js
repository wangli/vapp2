import { ref, watch } from "vue"

// 所有导航菜单 
export const menus = ref([])
// 拉平含页面菜单
export const flatMenus = ref([])
// 设置菜单唯一标识名称
export const keyName = ref('id')
// 被选中的当前菜单
export const currMenu = ref(null)
// 被选菜单key值
let keyValue = null

const flatMenusChildren = function (_menus) {
   _menus.forEach(item => {
      let menu = Object.assign({}, item)
      let children = menu.children
      menu.children && delete menu.children
      flatMenus.value.push(menu)
      if (children && Array.isArray(children)) {
         flatMenusChildren(children)
      }
   });
}

// 监听菜单数据变化
watch(menus, newMenus => {
   flatMenus.value = []
   if (newMenus && Array.isArray(newMenus)) {
      flatMenusChildren(newMenus)
   }
   keyValue && selectMenu()
}, { deep: true })

// 选择菜单
export const selectMenu = function (_keyValue) {
   _keyValue && (keyValue = _keyValue)
   currMenu.value = flatMenus.value.find(item => {
      return (new RegExp('^' + item[keyName.value]).test(keyValue))
   })
}
// 初始化
export const init = function (val, options) {
   if (Array.isArray(val)) {
      flatMenus.value = []
      flatMenusChildren(val)
      menus.value = val
      if (options) {
         options.keyName && (keyName.value = options.keyName)
      }
   }
}