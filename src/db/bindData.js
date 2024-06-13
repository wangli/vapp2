import { isReactive, watch } from 'vue'
import EXP from './localStore/explain'

let localStore = null
let unwatch = {}

export const initBind = (ls) => {
    localStore = ls
}

export const bindData = (name, data) => {
    if (isReactive(data)) {
        if (localStore && localStore.isset(name)) {
            let localData = localStore.defineObject(name, EXP)
            if (localData && typeof localData == 'object') {
                Object.assign(data, localData)
            }
        }
        unwatch[name] = watch(data, newData => {
            if (localStore) {
                localStore.defineObject(name, newData)
            }
        })
    }
}

export const unBindData = (name) => {
    if (name) {
        if (unwatch[name]) {
            unwatch[name]()
            delete unwatch[name]
        }
    } else {
        let names = Object.keys(unwatch)
        names.forEach(stop => stop())
        unwatch = {}
    }
}