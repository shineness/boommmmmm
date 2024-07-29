import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './MyApp.vue'
import router from './router'
import api from '@/api/api'
const pinia = createPinia()
const app = createApp(App)

app.config.globalProperties.$api = api
app.use(pinia)
app.use(router)

app.mount('#app')
