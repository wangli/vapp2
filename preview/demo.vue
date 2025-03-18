<template>
   <a href="/">呵呵呵，我是一个demo</a>
</template>
<script>
import { updata } from '../src'
export default {
   name: 'demo',
   setup() {
      updata.send({
         url: 'http://www.baidu.com'
      }).then(ok => {

      })
      return {}
   }
}
</script>