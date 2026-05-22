<template>
  <div class="user-page">
    <div class="auth-card">
      <div class="brand-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
          <path d="M32 8 C20 8 10 20 12 38 C14 50 24 56 32 56 C40 56 50 50 52 38 C54 20 44 8 32 8Z" fill="#7cb97e" opacity="0.85"/>
          <path d="M32 8 C38 14 44 10 46 6 C42 4 36 4 32 8Z" fill="#4a8a4c"/>
          <path d="M32 56 C32 40 28 24 32 8" stroke="#2d5a2e" stroke-width="1.5" stroke-linecap="round" fill="none"/>
        </svg>
      </div>

      <h1 class="card-title">Iniciar Sesión</h1>
      <p class="card-subtitle">Bienvenido de nuevo a Plantastic</p>

      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <div class="form-group">
        <label class="form-label" for="email">Correo Electrónico <span class="required">*</span></label>
        <input id="email" v-model="email" type="email" class="form-input"
          :class="{ 'input-error': fieldErrors.email }"
          @blur="validateEmail" />
        <span v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</span>
      </div>

      <div class="form-group">
        <label class="form-label" for="password">Contraseña <span class="required">*</span></label>
        <div class="input-wrapper">
          <input id="password" v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="form-input" :class="{ 'input-error': fieldErrors.password }"
            @blur="validatePassword"
            @keyup.enter="handleLogin" />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword" tabindex="-1">
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          </button>
        </div>
        <span v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</span>
      </div>

      <button class="btn-primary" @click="handleLogin" :disabled="loading">
        <span v-if="loading" class="loading-spinner"></span>
        {{ loading ? 'Iniciando...' : 'Iniciar Sesión' }}
      </button>

      <p class="switch-link">¿No tienes cuenta? <RouterLink to="/registro">Regístrate aquí</RouterLink></p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/useAuthStore'
import { useCartStore } from '@/stores/useCartStore'

export default {
  name: 'LoginView',
  setup() {
    const authStore = useAuthStore()
    const cartStore = useCartStore()
    return { authStore, cartStore }
  },
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false,
      showPassword: false,
      fieldErrors: {}
    }
  },
  methods: {
    validateEmail() {
      const e = { ...this.fieldErrors }
      if (!this.email) e.email = 'El correo es obligatorio.'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) e.email = 'Ingresa un correo válido.'
      else delete e.email
      this.fieldErrors = e
    },
    validatePassword() {
      const e = { ...this.fieldErrors }
      if (!this.password) e.password = 'La contraseña es obligatoria.'
      else delete e.password
      this.fieldErrors = e
    },
    async handleLogin() {
      this.validateEmail()
      this.validatePassword()
      if (Object.keys(this.fieldErrors).length) return

      this.loading = true
      this.error = ''
      try {
        await this.authStore.login(this.email, this.password)
        await this.cartStore.fetchCart()
        this.$router.push('/')
      } catch (e) {
        this.error = e.message || 'Correo electrónico o contraseña incorrectos.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
@import "@/assets/styles/user.css";
.required { color: #C62828; margin-left: 3px; }
</style>
