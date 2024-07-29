<template>
  <div style="width: 100%; background-color: red" ref="observer">child 1</div>
  <p :key="count">hello world {{ name }} =={{ count }}</p>
  <p>width:{{ count }}</p>
  <button @click="add80">+80</button>
  <button @click="change">back</button>
  <button @click="test">back</button>

  <input ref="input" />
  <div>
    <ul>
      <li v-for="(item, index) in arr()" :key="index">
        {{ item }}
      </li>
    </ul>
  </div>
</template>
<script></script>
<script setup>
// import { useCounterStore } from '@/stores/counter'
import { useDataStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, onMounted, getCurrentInstance, toRef, ref } from 'vue'
const { proxy } = getCurrentInstance()
const store = useDataStore()
function change() {
  store.$patch((state) => {
    console.log(222, state)

    state.count = 0
  })
}

const { add80 } = store
const { count } = storeToRefs(store)

// const width = computed(() => store.state.isFlag)
// const count = computed(() => {
//   console.log(store.state)
//   return store.state.count
// })
const name = 'shine'
const counter = () => {
  store.state.count *= 3
}
const model = import.meta.glob('../components/*.vue')
console.log(5555, model)
const arr = () => proxy.$api.getData()
let b = model['./HelloWorld.vue']
console.log(333, b)

onMounted(() => {
  const observer = ref(null)
  observer.value = new ResizeObserver((fn) => {
    console.log('resize')
  })
  observer.value.observe(proxy.$refs.observer)

  console.log('weqwe', proxy.$refs.observer)
})
// export default {
//   data() {
//     return {
//       name: 'child 1',
//       count: useDataStore().state,
//       f: ''
//     }
//   },
//   setup() {
//     const store = useDataStore()
//     console.log(111, storeToRefs(store).isFlag)
//     const { isFlag } = storeToRefs(store)
//     return { isFlag }
//   },
//   computed: {
//     ...mapState(useDataStore, ['counter']),
//     counter() {
//       const store = useDataStore()
//       console.log(store)
//       return store.count * 3
//     }
//   }
// }
</script>
