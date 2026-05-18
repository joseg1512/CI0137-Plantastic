<template>
  <div class="user-icon-wrapper">
    <router-link to="/user" class="user-icon-btn" :class="{ 'logged-in': isLoggedIn }" :title="isLoggedIn ? userName : 'Iniciar Sesión'">

      <span v-if="isLoggedIn" class="user-initials">{{ userInitials }}</span>
      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="user-svg">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'UserIcon',
  data() {
    return {
      user: JSON.parse(localStorage.getItem('plantastic_user') || 'null')
    }
  },
  computed: {
    isLoggedIn() { return !!this.user },
    userName()   { return this.user ? `${this.user.name} ${this.user.lastname || ''}`.trim() : '' },
    userInitials() {
      if (!this.user) return ''
      const first = (this.user.name || '').charAt(0).toUpperCase()
      const last  = (this.user.lastname || '').charAt(0).toUpperCase()
      return first + last || '?'
    }
  },
  mounted() {
    this._authHandler = () => {
      this.user = JSON.parse(localStorage.getItem('plantastic_user') || 'null')
    }
    window.addEventListener('plantastic-auth-change', this._authHandler)
  },
  beforeUnmount() {
    window.removeEventListener('plantastic-auth-change', this._authHandler)
  }
}
</script>

<style scoped>
/* Estilos heredados */
@import "@/assets/styles/user.css";
</style>