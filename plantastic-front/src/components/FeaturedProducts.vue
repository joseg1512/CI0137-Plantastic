<template>
  <section class="productos-destacados">
    <h2 class="tag tag--lg tag--wide tag--bosque section-tag center">PRODUCTOS DESTACADOS</h2>
    <h3 class="font-serif section-title">Lo más popular</h3>

    <div class="products-container">
      <ProductCard
        v-for="p in featuredProducts"
        :key="p.id"
        :product="p"
        :badge="p.badge"
        @add-to-cart="handleAddToCart"
      />
    </div>
  </section>
</template>

<script>
import ProductCard from './ProductCard.vue'
import { useProductStore } from '@/stores/useProductStore'
import { useCartStore } from '@/stores/useCartStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToast } from '@/composables/useToast'

const FEATURED = [
  { id: 'lavanda', badge: 'Bestseller' },
  { id: 'serum', badge: '' },
  { id: 'equinacea', badge: '' },
  { id: 'aceite-facial', badge: 'Nuevo' }
]

export default {
  name: 'FeaturedProducts',
  components: { ProductCard },
  setup() {
    const cartStore = useCartStore()
    const authStore = useAuthStore()
    const productStore = useProductStore()
    const { showToast } = useToast()
    return { cartStore, authStore, productStore, showToast }
  },
  created() {
    this.productStore.fetchProducts()
  },
  computed: {
    featuredProducts() {
      return FEATURED.map(f => {
        const p = this.productStore.products.find(p => p.id === f.id)
        return p ? { ...p, badge: f.badge } : null
      }).filter(Boolean)
    }
  },
  methods: {
    async handleAddToCart(producto) {
      if (!this.authStore.isLoggedIn) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        this.$router.push('/login')
        return
      }
      await this.cartStore.addItem(producto)
      this.showToast(`¡${producto.name} agregado al carrito!`)
    }
  }
}
</script>
