<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-panel">
        <!-- Progress bar -->
        <div class="modal-steps">
          <div v-for="n in 3" :key="n" class="step-item" :class="{ 'step-active': step >= n, 'step-done': step > n }">
            <div class="step-circle">{{ step > n ? '✓' : n }}</div>
            <span>{{ ['Envío', 'Pago', 'Confirmación'][n - 1] }}</span>
          </div>
          <div class="step-line" :style="{ width: ((step - 1) / 2 * 100) + '%' }"></div>
        </div>

        <!-- Step 1: Shipping -->
        <div v-if="step === 1" class="modal-body">
          <h2 class="modal-section-title">Datos de envío</h2>
          <div class="checkout-form">
            <div class="form-group">
              <label class="form-label">Nombre completo <span class="required">*</span></label>
              <input v-model="shipping.fullName" type="text" class="form-input"
                :class="getFieldClass('fullName')"
                @blur="validateShippingField('fullName')" />
              <span v-if="shippingErrors.fullName" class="field-error">{{ shippingErrors.fullName }}</span>
              <span v-else-if="shippingValid.fullName" class="field-valid">✓</span>
            </div>

            <div class="form-group">
              <label class="form-label">Correo electrónico <span class="required">*</span></label>
              <input v-model="shipping.email" type="email" class="form-input"
                :class="getFieldClass('email')"
                @blur="validateShippingField('email')" />
              <span v-if="shippingErrors.email" class="field-error">{{ shippingErrors.email }}</span>
              <span v-else-if="shippingValid.email" class="field-valid">✓</span>
            </div>

            <div class="form-group">
              <label class="form-label">Teléfono <span class="required">*</span></label>
              <input v-model="shipping.phone" type="tel" class="form-input" maxlength="8"
                :class="getFieldClass('phone')"
                @blur="validateShippingField('phone')" />
              <span v-if="shippingErrors.phone" class="field-error">{{ shippingErrors.phone }}</span>
              <span v-else-if="shippingValid.phone" class="field-valid">✓</span>
            </div>

            <div class="form-group">
              <label class="form-label">Provincia <span class="required">*</span></label>
              <select v-model="shipping.province" class="form-input"
                :class="getFieldClass('province')"
                @blur="validateShippingField('province')">
                <option value="">Seleccione una provincia</option>
                <option>San José</option>
                <option>Alajuela</option>
                <option>Cartago</option>
                <option>Heredia</option>
                <option>Guanacaste</option>
                <option>Puntarenas</option>
                <option>Limón</option>
              </select>
              <span v-if="shippingErrors.province" class="field-error">{{ shippingErrors.province }}</span>
              <span v-else-if="shippingValid.province" class="field-valid">✓</span>
            </div>

            <div class="form-group">
              <label class="form-label">Dirección exacta <span class="required">*</span></label>
              <textarea v-model="shipping.address" class="form-input" rows="3"
                :class="getFieldClass('address')"
                @blur="validateShippingField('address')"></textarea>
              <span v-if="shippingErrors.address" class="field-error">{{ shippingErrors.address }}</span>
              <span v-else-if="shippingValid.address" class="field-valid">✓</span>
            </div>

            <div class="form-group">
              <label class="form-label">Código postal <span class="required">*</span></label>
              <input v-model="shipping.zip" type="text" class="form-input" maxlength="5"
                :class="getFieldClass('zip')"
                @blur="validateShippingField('zip')" />
              <span v-if="shippingErrors.zip" class="field-error">{{ shippingErrors.zip }}</span>
              <span v-else-if="shippingValid.zip" class="field-valid">✓</span>
            </div>
          </div>

          <p class="required-note">* Campos obligatorios</p>

          <div class="modal-footer">
            <button class="modal-btn-secondary" @click="$emit('close')">Cancelar</button>
            <button class="modal-btn-primary" :disabled="!shippingFormValid" @click="step = 2">Continuar</button>
          </div>
        </div>

        <!-- Step 2: Payment -->
        <div v-if="step === 2" class="modal-body modal-body-two-col">
          <div class="payment-form-col">
            <h2 class="modal-section-title">Pago con tarjeta</h2>
            <div class="checkout-form">
              <div class="form-group">
                <label class="form-label">
                  Número de tarjeta
                  <span v-if="cardBrand" class="card-brand">{{ cardBrand }}</span>
                </label>
                <input v-model="payment.cardNumber" type="text" class="form-input" maxlength="19"
                  :class="getPaymentFieldClass('cardNumber')"
                  placeholder="XXXX XXXX XXXX XXXX"
                  autocomplete="cc-number"
                  @input="formatCardNumber"
                  @blur="validatePaymentField('cardNumber')" />
                <span v-if="paymentErrors.cardNumber" class="field-error">{{ paymentErrors.cardNumber }}</span>
                <span v-else-if="paymentValid.cardNumber" class="field-valid">✓</span>
              </div>

              <div class="form-group">
                <label class="form-label">Titular de la tarjeta</label>
                <input v-model="payment.holder" type="text" class="form-input"
                  :class="getPaymentFieldClass('holder')"
                  autocomplete="cc-name"
                  @blur="validatePaymentField('holder')" />
                <span v-if="paymentErrors.holder" class="field-error">{{ paymentErrors.holder }}</span>
                <span v-else-if="paymentValid.holder" class="field-valid">✓</span>
              </div>

              <div class="form-row-half">
                <div class="form-group">
                  <label class="form-label">Vencimiento (MM/AA)</label>
                  <input v-model="payment.expiry" type="text" class="form-input" maxlength="5"
                    :class="getPaymentFieldClass('expiry')"
                    placeholder="MM/AA"
                    autocomplete="cc-exp"
                    @input="formatExpiry"
                    @blur="validatePaymentField('expiry')" />
                  <span v-if="paymentErrors.expiry" class="field-error">{{ paymentErrors.expiry }}</span>
                  <span v-else-if="paymentValid.expiry" class="field-valid">✓</span>
                </div>

                <div class="form-group">
                  <label class="form-label">CVV</label>
                  <input v-model="payment.cvv" type="password" class="form-input" maxlength="4"
                    :class="getPaymentFieldClass('cvv')"
                    placeholder="•••"
                    autocomplete="cc-csc"
                    @input="payment.cvv = payment.cvv.replace(/\D/g, '')"
                    @blur="validatePaymentField('cvv')" />
                  <span v-if="paymentErrors.cvv" class="field-error">{{ paymentErrors.cvv }}</span>
                  <span v-else-if="paymentValid.cvv" class="field-valid">✓</span>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button class="modal-btn-secondary" @click="step = 1">Volver</button>
              <button class="modal-btn-primary" :disabled="!paymentFormValid || isProcessing" @click="confirmPayment">
                <span v-if="isProcessing" class="loading-spinner"></span>
                {{ isProcessing ? 'Procesando...' : 'Confirmar compra' }}
              </button>
            </div>
          </div>

          <div class="payment-summary-col">
            <h3 class="summary-col-title">Resumen del pedido</h3>
            <div class="payment-summary-items">
              <div v-for="item in cartStore.items" :key="item.id" class="payment-summary-row">
                <span>{{ item.name }} × {{ item.quantity }}</span>
                <span>₡{{ item.subtotal.toLocaleString('es-CR') }}</span>
              </div>
            </div>
            <div class="payment-summary-totals">
              <div class="payment-summary-line">
                <span>Subtotal</span><span>₡{{ cartStore.subtotal.toLocaleString('es-CR') }}</span>
              </div>
              <div class="payment-summary-line">
                <span>Envío</span><span>₡{{ cartStore.shipping.toLocaleString('es-CR') }}</span>
              </div>
              <div class="payment-summary-line payment-summary-total">
                <span>Total</span><span>₡{{ cartStore.total.toLocaleString('es-CR') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Confirmation -->
        <div v-if="step === 3" class="modal-body modal-body-confirm">
          <div class="confirm-check">
            <svg viewBox="0 0 52 52" class="check-svg">
              <circle class="check-circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="check-mark" fill="none" d="M14 27 L22 35 L38 19"/>
            </svg>
          </div>
          <h2 class="confirm-title">¡Compra realizada con éxito!</h2>
          <p class="confirm-subtitle">Gracias por tu pedido. Recibirás un correo de confirmación en breve.</p>
          <p class="confirm-order">Número de pedido: <strong>{{ orderNumber }}</strong></p>

          <div class="confirm-items">
            <div v-for="item in confirmedItems" :key="item.id" class="confirm-item-row">
              <span>{{ item.name }} × {{ item.quantity }}</span>
              <span>₡{{ item.subtotal.toLocaleString('es-CR') }}</span>
            </div>
            <div class="confirm-total-row">
              <span>Total pagado</span>
              <span>₡{{ confirmedTotal.toLocaleString('es-CR') }}</span>
            </div>
          </div>

          <button class="modal-btn-primary" style="width: 100%; margin-top: 24px;" @click="handleClose">
            Seguir comprando
          </button>
        </div>

        <!-- Close button always visible -->
        <button v-if="step < 3" class="modal-x-btn" @click="$emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { useCartStore } from '@/stores/useCartStore'
import { useAuthStore } from '@/stores/useAuthStore'

export default {
  name: 'CheckoutModal',
  emits: ['close'],
  setup() {
    const cartStore = useCartStore()
    const authStore = useAuthStore()
    return { cartStore, authStore }
  },
  data() {
    return {
      step: 1,
      isProcessing: false,
      orderNumber: '',
      confirmedItems: [],
      confirmedTotal: 0,

      shipping: { fullName: '', email: '', phone: '', province: '', address: '', zip: '' },
      shippingErrors: {},
      shippingValid: {},

      payment: { cardNumber: '', holder: '', expiry: '', cvv: '' },
      paymentErrors: {},
      paymentValid: {}
    }
  },
  mounted() {
    const u = this.authStore.user
    if (u) {
      this.shipping.fullName = [u.name, u.lastname].filter(Boolean).join(' ')
      this.shipping.email = u.email || ''
      this.shipping.phone = u.phone || ''
      if (u.provincia) this.shipping.province = u.provincia
      if (u.direccion) this.shipping.address = u.direccion
      if (u.codigoPostal) this.shipping.zip = u.codigoPostal
    }
    const prefilled = ['fullName', 'email', 'phone', 'province', 'address', 'zip']
    prefilled.forEach(f => {
      if (this.shipping[f]) this.validateShippingField(f)
    })
  },
  computed: {
    cardBrand() {
      const n = this.payment.cardNumber.replace(/\s/g, '')
      if (n.startsWith('4')) return 'Visa'
      if (n.startsWith('5')) return 'Mastercard'
      return ''
    },
    shippingFormValid() {
      const fields = ['fullName', 'email', 'phone', 'province', 'address', 'zip']
      return fields.every(f => this.shippingValid[f] && !this.shippingErrors[f])
    },
    paymentFormValid() {
      const fields = ['cardNumber', 'holder', 'expiry', 'cvv']
      return fields.every(f => this.paymentValid[f] && !this.paymentErrors[f])
    }
  },
  methods: {
    getFieldClass(field) {
      if (this.shippingErrors[field]) return 'input-error'
      if (this.shippingValid[field]) return 'input-valid'
      return ''
    },
    getPaymentFieldClass(field) {
      if (this.paymentErrors[field]) return 'input-error'
      if (this.paymentValid[field]) return 'input-valid'
      return ''
    },

    validateShippingField(field) {
      const v = { ...this.shippingValid }
      const e = { ...this.shippingErrors }
      const s = this.shipping
      const rules = {
        fullName: () => s.fullName.trim().split(/\s+/).length < 2 ? 'Ingresa al menos nombre y apellido.' : null,
        email: () => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email) ? 'Correo no válido.' : null,
        phone: () => !/^\d{8}$/.test(s.phone) ? 'Debe tener exactamente 8 dígitos.' : null,
        province: () => !s.province ? 'Selecciona una provincia.' : null,
        address: () => s.address.trim().length < 10 ? 'Mínimo 10 caracteres.' : null,
        zip: () => !/^\d{5}$/.test(s.zip) ? 'Debe tener exactamente 5 dígitos.' : null
      }
      const err = rules[field]?.()
      if (err) { e[field] = err; delete v[field] }
      else { delete e[field]; v[field] = true }
      this.shippingErrors = e
      this.shippingValid = v
    },

    validatePaymentField(field) {
      const v = { ...this.paymentValid }
      const e = { ...this.paymentErrors }
      const p = this.payment
      const rules = {
        cardNumber: () => p.cardNumber.replace(/\s/g, '').length !== 16 ? 'Debe tener 16 dígitos.' : null,
        holder: () => !(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(p.holder)) || p.holder.trim().length < 3 ? 'Solo letras, mínimo 3 caracteres.' : null,
        expiry: () => {
          const match = p.expiry.match(/^(\d{2})\/(\d{2})$/)
          if (!match) return 'Formato MM/AA.'
          const month = parseInt(match[1])
          const year = parseInt(match[2]) + 2000
          if (month < 1 || month > 12) return 'Mes inválido (01–12).'
          const now = new Date()
          if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) return 'Tarjeta vencida.'
          return null
        },
        cvv: () => !/^\d{3,4}$/.test(p.cvv) ? 'El CVV debe tener 3 o 4 dígitos.' : null
      }
      const err = rules[field]?.()
      if (err) { e[field] = err; delete v[field] }
      else { delete e[field]; v[field] = true }
      this.paymentErrors = e
      this.paymentValid = v
    },

    formatCardNumber(e) {
      let val = e.target.value.replace(/\D/g, '').slice(0, 16)
      this.payment.cardNumber = val.replace(/(.{4})/g, '$1 ').trim()
    },

    formatExpiry(e) {
      let val = e.target.value.replace(/\D/g, '').slice(0, 4)
      if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2)
      this.payment.expiry = val
    },

    async confirmPayment() {
      ['cardNumber', 'holder', 'expiry', 'cvv'].forEach(f => this.validatePaymentField(f))
      if (!this.paymentFormValid) return

      this.confirmedItems = [...this.cartStore.items]
      this.confirmedTotal = this.cartStore.total
      this.orderNumber = '#' + Math.floor(100000 + Math.random() * 900000)

      this.isProcessing = true
      await new Promise(resolve => setTimeout(resolve, 1500))
      this.isProcessing = false
      this.step = 3
    },

    async handleClose() {
      await this.cartStore.clearCart()
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
* {
  font-family: 'Jost', sans-serif;
}

h2, h3, button {
  font-family: 'Figtree', sans-serif;
}

.required { color: #C62828; margin-left: 3px; }
.required-note { color: #717171; font-size: 12px; margin-top: 12px; }

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-panel {
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 760px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 32px;
}

.modal-x-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: #717171;
  padding: 4px;
}

.modal-x-btn:hover { color: #1C1C1C; }

.modal-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 32px;
  position: relative;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
  z-index: 1;
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #C9DECC;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  background: #fff;
  color: #717171;
  transition: all 0.3s;
}

.step-active .step-circle {
  border-color: #3A6644;
  background: #3A6644;
  color: #fff;
}

.step-done .step-circle {
  border-color: #78A882;
  background: #78A882;
  color: #fff;
}

.step-item span {
  font-size: 0.75rem;
  color: #717171;
}

.step-active span { color: #3A6644; font-weight: 600; }

.step-line {
  position: absolute;
  top: 16px;
  left: 16.6%;
  height: 2px;
  background: #3A6644;
  transition: width 0.4s ease;
  z-index: 0;
}

.modal-section-title {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  color: #1B3A29;
  margin-bottom: 20px;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row-half {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.modal-btn-primary {
  background: #3A6644;
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.modal-btn-primary:hover:not(:disabled) { background: #78A882; }
.modal-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

.modal-btn-secondary {
  background: #F8F7F2;
  color: #1C1C1C;
  border: 1px solid #C9DECC;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
}

.modal-btn-secondary:hover { background: #EDE8DC; }

.modal-body-two-col {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
  align-items: start;
}

.payment-form-col { display: flex; flex-direction: column; }

.summary-col-title {
  font-family: var(--font-serif);
  font-size: 1rem;
  color: #1B3A29;
  margin-bottom: 12px;
}

.payment-summary-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.payment-summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #1C1C1C;
}

.payment-summary-totals {
  border-top: 1px solid #C9DECC;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.payment-summary-line {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #1C1C1C;
}

.payment-summary-total {
  font-weight: 700;
  font-size: 1rem;
  color: #1B3A29;
  border-top: 1px solid #C9DECC;
  padding-top: 8px;
  margin-top: 4px;
}

.card-brand {
  font-size: 0.75rem;
  background: #EDE8DC;
  color: #3A6644;
  font-weight: 700;
  border-radius: 4px;
  padding: 2px 8px;
  margin-left: 8px;
}

.modal-body-confirm {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 0;
}

.confirm-check {
  margin-bottom: 24px;
}

.check-svg {
  width: 80px;
  height: 80px;
}

.check-circle {
  stroke: #3A6644;
  stroke-width: 2;
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation: stroke-circle 0.5s ease forwards;
}

.check-mark {
  stroke: #3A6644;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke-check 0.4s ease 0.4s forwards;
}

@keyframes stroke-circle {
  to { stroke-dashoffset: 0; }
}

@keyframes stroke-check {
  to { stroke-dashoffset: 0; }
}

.confirm-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: #1B3A29;
  margin-bottom: 8px;
}

.confirm-subtitle {
  color: #717171;
  margin-bottom: 12px;
}

.confirm-order {
  color: #3A6644;
  font-weight: 600;
  margin-bottom: 20px;
}

.confirm-items {
  width: 100%;
  max-width: 360px;
  background: #F8F7F2;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.confirm-item-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #1C1C1C;
}

.confirm-total-row {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 1rem;
  color: #1B3A29;
  border-top: 1px solid #C9DECC;
  padding-top: 8px;
  margin-top: 4px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }

.input-error { border-color: #C62828 !important; }
.input-valid { border-color: #2E7D32 !important; }
.field-error { color: #C62828; font-size: 0.78rem; margin-top: 2px; display: block; }
.field-valid { color: #2E7D32; font-size: 0.85rem; margin-top: 2px; display: block; }

@media (max-width: 640px) {
  .modal-body-two-col { grid-template-columns: 1fr; }
  .modal-panel { padding: 20px 16px; }
}
</style>
