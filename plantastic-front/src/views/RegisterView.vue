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

      <h1 class="card-title">Crear Cuenta</h1>
      <p class="card-subtitle">Únete a la comunidad Plantastic</p>

      <div v-if="error" class="alert alert-error">{{ error }}</div>
      <div v-if="success" class="alert alert-success">{{ success }}</div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="name">Nombre <span class="required">*</span></label>
          <input id="name" v-model="form.name" type="text" class="form-input"
            :class="{ 'input-error': fieldErrors.name }"
            @blur="validateField('name')" />
          <span v-if="fieldErrors.name" class="field-error">{{ fieldErrors.name }}</span>
        </div>
        <div class="form-group">
          <label class="form-label" for="lastname">Apellido <span class="required">*</span></label>
          <input id="lastname" v-model="form.lastname" type="text" class="form-input"
            :class="{ 'input-error': fieldErrors.lastname }"
            @blur="validateField('lastname')" />
          <span v-if="fieldErrors.lastname" class="field-error">{{ fieldErrors.lastname }}</span>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="reg-email">Correo Electrónico <span class="required">*</span></label>
        <input id="reg-email" v-model="form.email" type="email" class="form-input"
          :class="{ 'input-error': fieldErrors.email }"
          @blur="validateField('email')" />
        <span v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</span>
      </div>

      <div class="form-group">
        <label class="form-label" for="phone">Teléfono (Costa Rica)</label>
        <input id="phone" v-model="form.phone" type="tel" class="form-input"
          :class="{ 'input-error': fieldErrors.phone }"
          placeholder="88888888" maxlength="8"
          @blur="validateField('phone')" />
        <span v-if="fieldErrors.phone" class="field-error">{{ fieldErrors.phone }}</span>
      </div>

      <div class="form-group">
        <label class="form-label" for="reg-password">Contraseña <span class="required">*</span></label>
        <div class="input-wrapper">
          <input id="reg-password" v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="form-input" :class="{ 'input-error': fieldErrors.password }"
            @blur="validateField('password')" />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword" tabindex="-1">
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          </button>
        </div>
        <span v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</span>
      </div>

      <div class="form-group">
        <label class="form-label" for="password2">Confirmar Contraseña</label>
        <div class="input-wrapper">
          <input id="password2" v-model="form.password2"
            :type="showPassword2 ? 'text' : 'password'"
            class="form-input" :class="{ 'input-error': fieldErrors.password2 }"
            @blur="validateField('password2')" />
          <button type="button" class="toggle-password" @click="showPassword2 = !showPassword2" tabindex="-1">
            <svg v-if="!showPassword2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          </button>
        </div>
        <span v-if="fieldErrors.password2" class="field-error">{{ fieldErrors.password2 }}</span>
      </div>

      <button class="btn-primary" @click="handleRegister" :disabled="loading">
        <span v-if="loading" class="loading-spinner"></span>
        {{ loading ? 'Registrando...' : 'Registrarse' }}
      </button>

      <p class="switch-link">¿Ya tienes cuenta? <RouterLink to="/login">Iniciar sesión</RouterLink></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterView',
  data() {
    return {
      form: { name: '', lastname: '', email: '', phone: '', password: '', password2: '' },
      error: '',
      success: '',
      loading: false,
      showPassword: false,
      showPassword2: false,
      fieldErrors: {}
    }
  },
  methods: {
    validateField(field) {
      const e = { ...this.fieldErrors }
      const f = this.form
      const rules = {
        name: () => !f.name.trim() ? 'El nombre es obligatorio.' : null,
        lastname: () => !f.lastname.trim() ? 'El apellido es obligatorio.' : null,
        email: () => !f.email ? 'El correo es obligatorio.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email) ? 'Ingresa un correo válido.' : null,
        phone: () => f.phone && !/^\d{8}$/.test(f.phone) ? 'El teléfono debe tener 8 dígitos.' : null,
        password: () => !f.password ? 'La contraseña es obligatoria.' : f.password.length < 8 ? 'Mínimo 8 caracteres.' : null,
        password2: () => !f.password2 ? 'Confirma la contraseña.' : f.password2 !== f.password ? 'Las contraseñas no coinciden.' : null
      }
      const msg = rules[field] ? rules[field]() : null
      if (msg) e[field] = msg
      else delete e[field]
      this.fieldErrors = e
    },
    async handleRegister() {
      ['name', 'lastname', 'email', 'phone', 'password', 'password2'].forEach(f => this.validateField(f))
      if (Object.keys(this.fieldErrors).length) return

      this.loading = true
      this.error = ''
      this.success = ''

      try {
        const res = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.form.name,
            lastname: this.form.lastname,
            email: this.form.email,
            phone: this.form.phone,
            password: this.form.password
          })
        })
        const data = await res.json()
        if (!res.ok) {
          this.error = data.message || 'No se pudo completar el registro.'
        } else {
          this.success = '¡Cuenta creada exitosamente! Ya puedes iniciar sesión.'
          setTimeout(() => this.$router.push('/login'), 1800)
        }
      } catch {
        this.error = 'No se pudo conectar con el servidor.'
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
