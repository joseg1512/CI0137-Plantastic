<template>
  <section class="perfil-page">
    <div class="perfil-container">
      <h1 class="font-serif perfil-title">Mi Perfil</h1>

      <!-- Personal data -->
      <div class="perfil-section card-base">
        <div class="perfil-section-header">
          <h2 class="perfil-section-title">Datos personales</h2>
          <button v-if="!editingPersonal" class="btn-edit" @click="startEditPersonal">Editar</button>
          <div v-else class="edit-actions">
            <button class="btn-cancel" @click="cancelEditPersonal">Cancelar</button>
            <button class="btn-save" :disabled="savingPersonal" @click="savePersonal">
              {{ savingPersonal ? 'Guardando…' : 'Guardar' }}
            </button>
          </div>
        </div>

        <div class="perfil-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Nombre</label>
              <input
                v-model="personal.name"
                type="text"
                class="form-input"
                :readonly="!editingPersonal"
                :class="{ 'input-readonly': !editingPersonal }"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Apellido</label>
              <input
                v-model="personal.lastname"
                type="text"
                class="form-input"
                :readonly="!editingPersonal"
                :class="{ 'input-readonly': !editingPersonal }"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Correo electrónico</label>
            <input
              v-model="personal.email"
              type="email"
              class="form-input input-readonly"
              readonly
            />
          </div>

          <div class="form-group">
            <label class="form-label">Teléfono</label>
            <input
              v-model="personal.phone"
              type="tel"
              class="form-input"
              maxlength="8"
              :readonly="!editingPersonal"
              :class="{ 'input-readonly': !editingPersonal }"
            />
          </div>

          <p v-if="personalError" class="field-error">{{ personalError }}</p>
          <p v-if="personalSuccess" class="field-success">{{ personalSuccess }}</p>
        </div>
      </div>

      <!-- Default shipping address -->
      <div class="perfil-section card-base">
        <div class="perfil-section-header">
          <h2 class="perfil-section-title">Dirección de envío predeterminada</h2>
        </div>

        <div class="perfil-form">
          <div class="form-group">
            <label class="form-label">Provincia</label>
            <select v-model="address.provincia" class="form-input">
              <option value="">Seleccione una provincia</option>
              <option>San José</option>
              <option>Alajuela</option>
              <option>Cartago</option>
              <option>Heredia</option>
              <option>Guanacaste</option>
              <option>Puntarenas</option>
              <option>Limón</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Dirección exacta</label>
            <textarea v-model="address.direccion" class="form-input" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Código postal</label>
            <input v-model="address.codigoPostal" type="text" class="form-input" maxlength="5" />
          </div>

          <p v-if="addressError" class="field-error">{{ addressError }}</p>
          <p v-if="addressSuccess" class="field-success">{{ addressSuccess }}</p>

          <div class="form-footer">
            <button class="btn-save" :disabled="savingAddress" @click="saveAddress">
              {{ savingAddress ? 'Guardando…' : 'Guardar dirección' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useAuthStore } from '@/stores/useAuthStore'

export default {
  name: 'PerfilView',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      editingPersonal: false,
      savingPersonal: false,
      personalError: '',
      personalSuccess: '',
      personal: { name: '', lastname: '', email: '', phone: '' },
      personalSnapshot: {},

      savingAddress: false,
      addressError: '',
      addressSuccess: '',
      address: { provincia: '', direccion: '', codigoPostal: '' }
    }
  },
  mounted() {
    const u = this.authStore.user
    if (u) {
      this.personal = {
        name: u.name || '',
        lastname: u.lastname || '',
        email: u.email || '',
        phone: u.phone || ''
      }
      this.address = {
        provincia: u.provincia || '',
        direccion: u.direccion || '',
        codigoPostal: u.codigoPostal || ''
      }
    }
  },
  methods: {
    startEditPersonal() {
      this.personalSnapshot = { ...this.personal }
      this.editingPersonal = true
      this.personalError = ''
      this.personalSuccess = ''
    },
    cancelEditPersonal() {
      this.personal = { ...this.personalSnapshot }
      this.editingPersonal = false
      this.personalError = ''
    },
    async savePersonal() {
      this.personalError = ''
      this.personalSuccess = ''

      if (!this.personal.name.trim() || !this.personal.lastname.trim()) {
        this.personalError = 'Nombre y apellido son obligatorios.'
        return
      }
      if (this.personal.phone && !/^\d{8}$/.test(this.personal.phone)) {
        this.personalError = 'El teléfono debe tener exactamente 8 dígitos.'
        return
      }

      this.savingPersonal = true
      try {
        const res = await fetch('/api/users/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.personal.name.trim(),
            lastname: this.personal.lastname.trim(),
            phone: this.personal.phone.trim()
          })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Error al guardar.')
        this.authStore.user = { ...this.authStore.user, ...data.usuario }
        this.editingPersonal = false
        this.personalSuccess = 'Perfil actualizado.'
      } catch (err) {
        this.personalError = err.message
      } finally {
        this.savingPersonal = false
      }
    },
    async saveAddress() {
      this.addressError = ''
      this.addressSuccess = ''

      if (!this.address.provincia) {
        this.addressError = 'Selecciona una provincia.'
        return
      }
      if (this.address.codigoPostal && !/^\d{5}$/.test(this.address.codigoPostal)) {
        this.addressError = 'El código postal debe tener 5 dígitos.'
        return
      }

      this.savingAddress = true
      try {
        const res = await fetch('/api/users/address', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.address)
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Error al guardar.')
        this.authStore.user = { ...this.authStore.user, ...data.usuario }
        this.addressSuccess = 'Dirección guardada.'
      } catch (err) {
        this.addressError = err.message
      } finally {
        this.savingAddress = false
      }
    }
  }
}
</script>

<style scoped>
.perfil-page {
  min-height: calc(100vh - 90px);
  padding: 60px 10%;
  background: var(--color-background);
}

.perfil-container {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.perfil-title {
  font-size: 2rem;
  color: #1B3A29;
  margin: 0 0 8px;
}

.perfil-section {
  padding: 32px;
}

.perfil-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.perfil-section-title {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  color: #1B3A29;
  margin: 0;
}

.edit-actions {
  display: flex;
  gap: 10px;
}

.btn-edit {
  background: none;
  border: 1px solid #C9DECC;
  color: #3A6644;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.btn-edit:hover { background: #EDE8DC; }

.btn-cancel {
  background: none;
  border: 1px solid #C9DECC;
  color: #717171;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-save {
  background: #3A6644;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-save:hover:not(:disabled) { background: #78A882; }
.btn-save:disabled { opacity: 0.55; cursor: not-allowed; }

.perfil-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 0.85rem;
  color: #717171;
  font-weight: 500;
}

.form-input {
  padding: 10px 14px;
  border: 1px solid #C9DECC;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: 'Jost', sans-serif;
  color: #1C1C1C;
  background: #fff;
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
}

.form-input:focus { border-color: #3A6644; }

.input-readonly {
  background: #F8F7F2;
  color: #717171;
  cursor: default;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.field-error {
  color: #C62828;
  font-size: 0.82rem;
}

.field-success {
  color: #2E7D32;
  font-size: 0.82rem;
}

@media (max-width: 600px) {
  .perfil-page { padding: 40px 5%; }
  .perfil-section { padding: 20px 16px; }
  .form-row { grid-template-columns: 1fr; }
}
</style>
