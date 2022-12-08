import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')
const config = require('./package.json')

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
   if (command == 'build') {
      return {
         define: {
            "__VAPP2_VERSION__": `'vapp2:${config.version}'`
         },
         build: {
            sourcemap: true,
            lib: {
               entry: path.resolve(__dirname, 'src/index.js'),
               name: 'vapp2'
            },
            rollupOptions: {
               // 请确保外部化那些你的库中不需要的依赖
               external: ['vue', 'vue-router'],
               output: {
                  // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                  globals: {
                     'vue': 'Vue',
                     'vue-router': 'VueRouter'
                  }
               }
            }
         }
      }
   } else {
      return {
         define: {
            "__VAPP2_VERSION__": `'vapp2:${config.version}'`
         },
         server: {
            force: true,
            fs: {
               strict: false
            }
         },
         plugins: [
            vue()
         ]
      }
   }
})