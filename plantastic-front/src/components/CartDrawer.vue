<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="cartStore.isOpen" class="drawer-overlay" @click.self="cartStore.closeDrawer()">
        <div class="drawer-panel">
          <div class="drawer-header">
            <h2 class="drawer-title">Tu carrito</h2>
            <button class="drawer-close" @click="cartStore.closeDrawer()">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div v-if="cartStore.items.length === 0" class="drawer-empty">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#C9DECC" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <p>Tu carrito está vacío</p>
            <RouterLink to="/tienda" class="drawer-shop-link" @click="cartStore.closeDrawer()">Ver productos</RouterLink>
          </div>

          <div v-else class="drawer-body">
            <div class="drawer-items">
              <div v-for="item in cartStore.items" :key="item.id" class="drawer-item">
                <div class="drawer-item-img-wrap">
                  <img :src="getImageSrc(item)" :alt="item.name" class="drawer-item-img" />
                </div>
                <div class="drawer-item-info">
                  <p class="drawer-item-name">{{ item.name }}</p>
                  <p class="drawer-item-unit">₡{{ item.price.toLocaleString('es-CR') }} c/u</p>
                  <div class="drawer-item-qty">
                    <button class="qty-btn" @click="changeQty(item, item.quantity - 1)">−</button>
                    <span class="qty-num">{{ item.quantity }}</span>
                    <button class="qty-btn" @click="changeQty(item, item.quantity + 1)">+</button>
                  </div>
                </div>
                <div class="drawer-item-right">
                  <p class="drawer-item-subtotal">₡{{ item.subtotal.toLocaleString('es-CR') }}</p>
                  <button class="drawer-item-remove" @click="cartStore.removeItem(item.id)" title="Eliminar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="drawer-summary">
              <div class="summary-totals">
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>₡{{ cartStore.subtotal.toLocaleString('es-CR') }}</span>
                </div>
                <div class="summary-row">
                  <span>Envío</span>
                  <span>₡{{ cartStore.shipping.toLocaleString('es-CR') }}</span>
                </div>
                <div class="summary-row summary-total">
                  <span>Total</span>
                  <span>₡{{ cartStore.total.toLocaleString('es-CR') }}</span>
                </div>
              </div>

              <button class="drawer-checkout-btn" @click="openCheckout">Proceder al pago</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <CheckoutModal v-if="showCheckout" @close="showCheckout = false" />
  </Teleport>
</template>

<script>
import { watch } from 'vue'
import { useCartStore } from '@/stores/useCartStore'
import { useAuthStore } from '@/stores/useAuthStore'
import CheckoutModal from './CheckoutModal.vue'

export default {
  name: 'CartDrawer',
  components: { CheckoutModal },
  setup() {
    const cartStore = useCartStore()
    const authStore = useAuthStore()

    watch(() => cartStore.isOpen, (open) => {
      if (open && !authStore.isLoggedIn) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      document.body.style.overflow = open ? 'hidden' : ''
    })

    return { cartStore, authStore }
  },
  data() {
    return { showCheckout: false }
  },
  beforeUnmount() {
    document.body.style.overflow = ''
  },
  methods: {
    getImageSrc(item) {
      if (item.category === 'plantas') {
        return require(`@/assets/plantas/${item.image}.png`)
      }
      return require(`@/assets/productos/${item.image}.png`)
    },
    changeQty(item, newQty) {
      this.cartStore.updateQuantity(item.id, newQty)
    },
    openCheckout() {
      this.cartStore.closeDrawer()
      this.showCheckout = true
    }
  }
}
</script>

<style scoped>
* {
  font-family: 'Jost', sans-serif;
}

.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.drawer-panel {
  width: 400px;
  max-width: 100vw;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: -4px 0 24px rgba(0,0,0,0.15);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #C9DECC;
}

.drawer-title {
  font-family: 'Figtree', sans-serif;
  font-size: 1.2rem;
  color: #1B3A29;
  margin: 0;
}

.drawer-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #717171;
  padding: 4px;
  display: flex;
  align-items: center;
}

.drawer-close:hover { color: #1C1C1C; }

.drawer-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #717171;
}

.drawer-shop-link {
  background: #3A6644;
  color: #fff;
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
}

.drawer-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.drawer-items {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.drawer-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding-bottom: 16px;
  border-bottom: 1px solid #EDE8DC;
}

.drawer-item:last-child { border-bottom: none; }

.drawer-item-img-wrap {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: #EDE8DC;
}

.drawer-item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.drawer-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.drawer-item-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1C1C1C;
  margin: 0;
}

.drawer-item-unit {
  font-size: 0.8rem;
  color: #717171;
  margin: 0;
}

.drawer-item-qty {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.qty-btn {
  width: 26px;
  height: 26px;
  border: 1px solid #C9DECC;
  border-radius: 4px;
  background: #F8F7F2;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3A6644;
  font-weight: 700;
  font-family: 'Figtree', sans-serif;
}

.qty-btn:hover { background: #C9DECC; }

.qty-num {
  min-width: 24px;
  text-align: center;
  font-weight: 600;
}

.drawer-item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.drawer-item-subtotal {
  font-weight: 700;
  color: #1B3A29;
  font-size: 0.95rem;
  margin: 0;
}

.drawer-item-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: #717171;
  padding: 4px;
}

.drawer-item-remove:hover { color: #C62828; }

.drawer-summary {
  border-top: 1px solid #C9DECC;
  padding: 16px 24px 24px;
  background: #F8F7F2;
}

.summary-totals {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #1C1C1C;
}

.summary-total {
  font-weight: 600;
  font-size: 1rem;
  color: #1B3A29;
  border-top: 1px solid #C9DECC;
  padding-top: 10px;
  margin-top: 2px;
}

.drawer-checkout-btn {
  margin-top: 16px;
  width: 100%;
  background: #3A6644;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Figtree', sans-serif;
  cursor: pointer;
  transition: background 0.2s;
}

.drawer-checkout-btn:hover { background: #78A882; }

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;
}

.drawer-enter-active .drawer-panel,
.drawer-leave-active .drawer-panel {
  transition: transform 0.25s ease;
}

.drawer-enter-from,
.drawer-leave-to { opacity: 0; }

.drawer-enter-from .drawer-panel,
.drawer-leave-to .drawer-panel {
  transform: translateX(100%);
}
</style>
