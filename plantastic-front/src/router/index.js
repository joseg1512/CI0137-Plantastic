import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TiendaView from '../views/TiendaView.vue'
import GuideView from '../views/GuideView.vue'
import UserView from '../components/UserView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/tienda',
    name: 'tienda',
    component: TiendaView
  },
  {
    path: '/guia',
    name: 'guia',
    component: GuideView
  },
  {
    path: '/user',
    name: 'user',
    component: UserView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
