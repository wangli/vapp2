import { event } from './common'
import token from './db/token'

export const isAuth = token.isAuth

// 创建应用
event.on('app-created', () => {
   token.verify()
})