import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TiendaView from '../views/TiendaView.vue'
import GuideView from '../views/GuideView.vue'
import UserView from '../components/UserView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import PerfilView from '../views/PerfilView.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: 'Plantastic' } },
  { path: '/tienda', name: 'tienda', component: TiendaView, meta: { title: 'Tienda — Plantastic' } },
  { path: '/guia', name: 'guia', component: GuideView, meta: { title: 'Guía Medicinal — Plantastic' } },
  { path: '/user', name: 'user', component: UserView, meta: { title: 'Plantastic' } },
  { path: '/login', name: 'login', component: LoginView, meta: { title: 'Iniciar sesión — Plantastic' } },
  { path: '/registro', name: 'registro', component: RegisterView, meta: { title: 'Registro — Plantastic' } },
  { path: '/perfil', name: 'perfil', component: PerfilView, meta: { title: 'Mi Perfil — Plantastic' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  document.title = to.meta?.title || 'Plantastic'

  const authStore = useAuthStore()

  if (!authStore.checked) {
    await authStore.checkSession()
  }

  const protectedRoutes = ['perfil', 'user']

  if (protectedRoutes.includes(to.name) && !authStore.isLoggedIn) {
    return { name: 'login' }
  }
})

export default router
