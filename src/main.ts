import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Dashboard from './views/Dashboard.vue'
import Transactions from './views/Transactions.vue'
import Statistics from './views/Statistics.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/transactions', component: Transactions },
  { path: '/statistics', component: Statistics }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')