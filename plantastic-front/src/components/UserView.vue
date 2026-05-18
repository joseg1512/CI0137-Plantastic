<template>
  <div class="user-page">
    <div v-if="isLoggedIn" class="profile-page">

      <!-- Perfil -->
      <div class="profile-card">
        <div class="profile-header">
          <div>
            <h1 class="profile-title">Mi Perfil</h1>
            <p class="profile-welcome">Bienvenido, {{ currentUser.name }} {{ currentUser.lastname }}</p>
            <div class="profile-data">
              <span class="profile-data-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
                {{ currentUser.email }}
              </span>
              <span v-if="currentUser.phone" class="profile-data-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg>
                {{ currentUser.phone }}
              </span>
            </div>
          </div>
          <button class="btn-logout" @click="logout">Cerrar Sesión</button>
        </div>
      </div>

      <!-- Carrito & Historial -->
      <div class="profile-tabs">
        <button
          class="profile-tab"
          :class="{ active: profileTab === 'carrito' }"
          @click="profileTab = 'carrito'"
        >
          🛒 Carrito Actual ({{ carritoCount }})
        </button>
        <button
          class="profile-tab"
          :class="{ active: profileTab === 'historial' }"
          @click="profileTab = 'historial'"
        >
          📦 Historial de Compras ({{ historialCount }})
        </button>
      </div>

      <!-- Carrito -->
      <div v-if="profileTab === 'carrito'" class="profile-panel">
        <h2 class="panel-title">Carrito de Compras</h2>
        <div v-if="carritoCount === 0" class="empty-state">
          <span class="empty-emoji">🛒</span>
          <p class="empty-text">Tu carrito está vacío</p>
          <router-link to="/tienda" class="btn-tienda">Ir a la Tienda</router-link>
        </div>
        <div v-else class="carrito-items">
          <!-- items del carrito cuando existan -->
        </div>
      </div>

      <!--Historial -->
      <div v-if="profileTab === 'historial'" class="profile-panel">
        <h2 class="panel-title">Historial de Compras</h2>
        <div v-if="historialCount === 0" class="empty-state">
          <span class="empty-emoji">📦</span>
          <p class="empty-text">Aún no has realizado ninguna compra</p>
        </div>
        <div v-else class="historial-items">
          <!-- aquí se agrega el historial cuando se integre con compras -->
        </div>
      </div>
    </div>

    <div v-else class="auth-card">
      <!-- Logo -->
      <div class="brand-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
          <path d="M32 8 C20 8 10 20 12 38 C14 50 24 56 32 56 C40 56 50 50 52 38 C54 20 44 8 32 8Z" fill="#7cb97e" opacity="0.85"/>
          <path d="M32 8 C38 14 44 10 46 6 C42 4 36 4 32 8Z" fill="#4a8a4c"/>
          <path d="M32 56 C32 40 28 24 32 8" stroke="#2d5a2e" stroke-width="1.5" stroke-linecap="round" fill="none"/>
        </svg>
      </div>

      <div class="tabs">
        <button class="tab-btn" :class="{ active: activeTab === 'login' }" @click="switchTab('login')">Iniciar Sesión</button>
        <button class="tab-btn" :class="{ active: activeTab === 'register' }" @click="switchTab('register')">Registrarse</button>
      </div>

      <div v-if="activeTab === 'login'" class="tab-panel">
        <h1 class="card-title">Iniciar Sesión</h1>
        <p class="card-subtitle">Bienvenido de nuevo a Plantastic</p>

        <div v-if="loginError" class="alert alert-error">{{ loginError }}</div>
        <div v-if="loginSuccess" class="alert alert-success">{{ loginSuccess }}</div>

        <div class="form-group">
          <label class="form-label" for="login-email">Correo Electrónico</label>
          <input id="login-email" v-model="loginForm.email" type="email" class="form-input"
            :class="{ 'input-error': loginFieldErrors.email }"
            @blur="validateLoginField('email')" />
          <span v-if="loginFieldErrors.email" class="field-error">{{ loginFieldErrors.email }}</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="login-password">Contraseña</label>
          <div class="input-wrapper">
            <input id="login-password" v-model="loginForm.password"
              :type="showLoginPassword ? 'text' : 'password'"
              class="form-input" :class="{ 'input-error': loginFieldErrors.password }"
              @blur="validateLoginField('password')" />
            <button type="button" class="toggle-password" @click="showLoginPassword = !showLoginPassword" tabindex="-1">
              <svg v-if="!showLoginPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
          <span v-if="loginFieldErrors.password" class="field-error">{{ loginFieldErrors.password }}</span>
        </div>

        <button class="btn-primary" @click="handleLogin" :disabled="loginLoading">
          <span v-if="loginLoading" class="loading-spinner"></span>
          {{ loginLoading ? 'Iniciando...' : 'Iniciar Sesión' }}
        </button>

        <p class="switch-link">¿No tienes cuenta? <a href="#" @click.prevent="switchTab('register')">Regístrate aquí</a></p>
      </div>

      <!-- Registro -->
      <div v-if="activeTab === 'register'" class="tab-panel">
        <h1 class="card-title">Crear Cuenta</h1>
        <p class="card-subtitle">Únete a la comunidad Plantastic</p>

        <div v-if="registerError" class="alert alert-error">{{ registerError }}</div>
        <div v-if="registerSuccess" class="alert alert-success">{{ registerSuccess }}</div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="reg-name">Nombre</label>
            <input id="reg-name" v-model="registerForm.name" type="text" class="form-input"
              :class="{ 'input-error': registerFieldErrors.name }"
              @blur="validateRegisterField('name')" />
            <span v-if="registerFieldErrors.name" class="field-error">{{ registerFieldErrors.name }}</span>
          </div>
          <div class="form-group">
            <label class="form-label" for="reg-lastname">Apellido</label>
            <input id="reg-lastname" v-model="registerForm.lastname" type="text" class="form-input"
              :class="{ 'input-error': registerFieldErrors.lastname }"
              @blur="validateRegisterField('lastname')" />
            <span v-if="registerFieldErrors.lastname" class="field-error">{{ registerFieldErrors.lastname }}</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-email">Correo Electrónico</label>
          <input id="reg-email" v-model="registerForm.email" type="email" class="form-input"
            :class="{ 'input-error': registerFieldErrors.email }"
            @blur="validateRegisterField('email')" />
          <span v-if="registerFieldErrors.email" class="field-error">{{ registerFieldErrors.email }}</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-telefono">Teléfono (Costa Rica)</label>
          <input id="reg-telefono" v-model="registerForm.telefono" type="tel" class="form-input"
            :class="{ 'input-error': registerFieldErrors.telefono }"
            placeholder="88888888" maxlength="8"
            @blur="validateRegisterField('telefono')" />
          <span v-if="registerFieldErrors.telefono" class="field-error">{{ registerFieldErrors.telefono }}</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-password">Contraseña</label>
          <div class="input-wrapper">
            <input id="reg-password" v-model="registerForm.password"
              :type="showRegPassword ? 'text' : 'password'"
              class="form-input" :class="{ 'input-error': registerFieldErrors.password }"
              @blur="validateRegisterField('password')" />
            <button type="button" class="toggle-password" @click="showRegPassword = !showRegPassword" tabindex="-1">
              <svg v-if="!showRegPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
          <span v-if="registerFieldErrors.password" class="field-error">{{ registerFieldErrors.password }}</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-password2">Confirmar Contraseña</label>
          <div class="input-wrapper">
            <input id="reg-password2" v-model="registerForm.password2"
              :type="showRegPassword2 ? 'text' : 'password'"
              class="form-input" :class="{ 'input-error': registerFieldErrors.password2 }"
              @blur="validateRegisterField('password2')" />
            <button type="button" class="toggle-password" @click="showRegPassword2 = !showRegPassword2" tabindex="-1">
              <svg v-if="!showRegPassword2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
          <span v-if="registerFieldErrors.password2" class="field-error">{{ registerFieldErrors.password2 }}</span>
        </div>

        <button class="btn-primary" @click="handleRegister" :disabled="registerLoading">
          <span v-if="registerLoading" class="loading-spinner"></span>
          {{ registerLoading ? 'Registrando...' : 'Registrarse' }}
        </button>

        <p class="switch-link">¿Ya tienes cuenta? <a href="#" @click.prevent="switchTab('login')">Iniciar sesión</a></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserView',
  data() {
    return {
      activeTab: 'login',
      isLoggedIn: false,
      currentUser: {},
      profileTab: 'carrito',

      // Cuando se integre con compras se meten los productos
      carritoItems: [],
      historialItems: [],

      loginForm: { email: '', password: '' },
      loginError: '',
      loginSuccess: '',
      loginLoading: false,
      loginFieldErrors: {},
      showLoginPassword: false,

      registerForm: { name: '', lastname: '', email: '', phone: '', password: '', password2: '' },
      registerError: '',
      registerSuccess: '',
      registerLoading: false,
      registerFieldErrors: {},
      showRegPassword: false,
      showRegPassword2: false,
    }
  },
  computed: {
    carritoCount()  { return this.carritoItems.length },
    historialCount(){ return this.historialItems.length },
  },
  mounted() {
    this.checkLoginStatus()
    if (this.$route?.query?.tab === 'register') this.activeTab = 'register'
  },
  methods: {
    checkLoginStatus() {
      const stored = localStorage.getItem('plantastic_user')
      if (stored) {
        this.isLoggedIn = true
        this.currentUser = JSON.parse(stored)
      }
    },

    switchTab(tab) {
      this.activeTab = tab
      this.loginError = this.loginSuccess = this.registerError = this.registerSuccess = ''
      this.loginFieldErrors = {}
      this.registerFieldErrors = {}
    },

    validateLoginField(field) {
      const e = { ...this.loginFieldErrors }
      if (field === 'email') {
        if (!this.loginForm.email) e.email = 'El correo es obligatorio.'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.loginForm.email)) e.email = 'Ingresa un correo válido.'
        else delete e.email
      }
      if (field === 'password') {
        if (!this.loginForm.password) e.password = 'La contraseña es obligatoria.'
        else delete e.password
      }
      this.loginFieldErrors = e
    },

    validateRegisterField(field) {
      const e = { ...this.registerFieldErrors }
      const f = this.registerForm
      const rules = {
        name:      () => !f.name.trim() ? 'El nombre es obligatorio.' : null,
        lastname:    () => !f.lastname.trim() ? 'El apellido es obligatorio.' : null,
        email:      () => !f.email ? 'El correo es obligatorio.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email) ? 'Ingresa un correo válido.' : null,
        phone:    () => f.phone && !/^\d{8}$/.test(f.phone) ? 'El teléfono debe tener 8 dígitos.' : null,
        password:  () => !f.password ? 'La contraseña es obligatoria.' : f.password.length < 6 ? 'Mínimo 6 caracteres.' : null,
        password2: () => !f.password2 ? 'Confirma la contraseña.' : f.password2 !== f.password ? 'Las contraseñas no coinciden.' : null,
      }
      const msg = rules[field]?.()
      if (msg) e[field] = msg
      else delete e[field]
      this.registerFieldErrors = e
    },

    async handleLogin() {
      ['email', 'password'].forEach(f => this.validateLoginField(f))
      if (Object.keys(this.loginFieldErrors).length) return

      this.loginLoading = true
      this.loginError = ''
      this.loginSuccess = ''

      try {
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.loginForm.email, password: this.loginForm.password })
        })
        const data = await response.json()

        if (!response.ok) {
          this.loginError = data.message || 'Correo electrónico o contraseña incorrectos.'
        } else {
          const usuario = data.usuario || data
          localStorage.setItem('plantastic_user', JSON.stringify(usuario))
          window.dispatchEvent(new Event('plantastic-auth-change'))
          this.loginSuccess = `¡Bienvenido, ${usuario.name}!`
          setTimeout(() => { this.currentUser = usuario; this.isLoggedIn = true }, 700)
        }
      } catch {
        this.loginError = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.'
      } finally {
        this.loginLoading = false
      }
    },

    async handleRegister() {
      ['name', 'lastname', 'email', 'phone', 'password', 'password2'].forEach(f => this.validateRegisterField(f))
      console.log('Errores de validación:', this.registerFieldErrors)
      if (Object.keys(this.registerFieldErrors).length) return

      this.registerLoading = true
      this.registerError = ''
      this.registerSuccess = ''

      try {
        const response = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.registerForm.name,
            lastname: this.registerForm.lastname,
            email: this.registerForm.email,
            phone: this.registerForm.phone,
            password: this.registerForm.password
          })
        })
        const data = await response.json()

        if (!response.ok) {
          this.registerError = data.message || 'No se pudo completar el registro.'
        } else {
          this.registerSuccess = '¡Cuenta creada exitosamente! Ya puedes iniciar sesión.'
          this.registerForm = { name: '', lastname: '', email: '', phone: '', password: '', password2: '' }
          setTimeout(() => this.switchTab('login'), 1800)
        }
      } catch {
        this.registerError = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.'
      } finally {
        this.registerLoading = false
      }
    },

    logout() {
      localStorage.removeItem('plantastic_user')
      window.dispatchEvent(new Event('plantastic-auth-change'))
      this.isLoggedIn = false
      this.currentUser = {}
      this.profileTab = 'carrito'
      this.switchTab('login')
    }
  }
}
</script>

<style scoped>
/* Estilos heredados */
@import "@/assets/styles/user.css";
</style>