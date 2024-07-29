<template>
  <App></App>
</template>
<script lang="ts">
import App from './App.vue'

export default {
  data() {
    return {
      id: 'node',
      msg: '神器',
      rawHtml: '<a>www.baidu.com</a>'
    }
  },
  components: { App }
}
</script>
