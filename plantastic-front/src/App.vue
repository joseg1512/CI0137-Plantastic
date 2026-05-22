<template>
  <Navbar />
  <router-view />
  <FooterSection />
  <CartDrawer />
  <ToastNotification />
</template>

<script>
import Navbar from './components/Navbar.vue'
import FooterSection from './components/FooterSection.vue'
import CartDrawer from './components/CartDrawer.vue'
import ToastNotification from './components/ToastNotification.vue'
import { useAuthStore } from './stores/useAuthStore'
import { useCartStore } from './stores/useCartStore'

export default {
  name: 'App',
  components: { Navbar, FooterSection, CartDrawer, ToastNotification },
  setup() {
    const authStore = useAuthStore()
    const cartStore = useCartStore()
    return { authStore, cartStore }
  },
  async mounted() {
    await this.authStore.checkSession()
    if (this.authStore.isLoggedIn) {
      await this.cartStore.fetchCart()
    }
  }
}
</script>
