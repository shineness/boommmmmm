<template>
  <h1>{{ a }}</h1>
  <h3>列表渲染</h3>
  <div>
    <p v-for="(item, index) of names" :key="index">{{ item.id }}-{{ item.age }}-{{ index }}</p>
  </div>
  <button @click.prevent="handdleClick(`123`, $event)">click me!</button>
  <button @click="add">add</button>
  <p v-for="i in list" :key="i">{{ i }}</p>
</template>
<script setup>
import { useDataStore } from '@/stores'
const store = useDataStore()
const add = () => {
  store.count++
}
// export default {
//   name: 'TestApp',
//   data() {
//     return {
//       a: 11112333,
//       list: [1, 2, 3, 4],
//       names: [
//         {
//           id: '1',
//           name: '张三',
//           age: 18
//         },
//         {
//           id: '2',
//           name: '李四',
//           age: 22
//         }
//       ]
//     }
//   },
//   methods: {
//     handdleClick(msg, e) {
//       useDataStore().state.isFlag = !useDataStore().state.isFlag
//     },
//     add() {
//       // this.list.push(5)
//       useDataStore().state.count++
//     }
//   },
//   computed: {}
// }
</script>
