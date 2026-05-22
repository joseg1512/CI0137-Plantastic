<template>
  <section class="tienda-hero">
    <div class="hero-content tienda-hero-content">
      <h1 class="font-serif hero-title tienda-title">Nuestra tienda</h1>
      <p class="hero-subtitle tienda-subtitle">
        Descubre plantas y productos de belleza ecológica.
      </p>
    </div>
  </section>

  <section class="tienda-controls">
    <div class="filter-buttons">
      <button type="button" class="filter-btn" :class="{ 'filter-btn-active': activeCategory === 'Todos' }" @click="activeCategory = 'Todos'">
        🌿 Todos
      </button>
      <button type="button" class="filter-btn" :class="{ 'filter-btn-active': activeCategory === 'plantas' }" @click="activeCategory = 'plantas'">
        🌱 Plantas medicinales
      </button>
      <button type="button" class="filter-btn" :class="{ 'filter-btn-active': activeCategory === 'belleza' }" @click="activeCategory = 'belleza'">
        🧴 Belleza ecológica
      </button>
    </div>

    <div class="search-wrapper">
      <input v-model="searchText" type="text" placeholder="Buscar productos..." class="search-input" />
      <span class="search-icon">🔍</span>
    </div>
  </section>

  <section class="tienda-products">
    <p v-if="activeQuery" class="results-count">
      {{ filteredProducts.length }} resultado(s) para "<strong>{{ activeQuery }}</strong>"
    </p>
    <p v-else class="results-count">{{ filteredProducts.length }} productos encontrados</p>

    <div class="products-grid">
      <ProductCard
        v-for="producto in filteredProducts"
        :key="producto.id"
        :product="producto"
        @add-to-cart="handleAddToCart"
      />
    </div>
  </section>
</template>

<script>
import ProductCard from '../components/ProductCard.vue'
import { productos } from '@/data/productos.js'
import { useCartStore } from '@/stores/useCartStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToast } from '@/composables/useToast'

export default {
  name: 'TiendaView',
  components: { ProductCard },
  setup() {
    const cartStore = useCartStore()
    const authStore = useAuthStore()
    const { showToast } = useToast()
    return { cartStore, authStore, showToast }
  },
  created() {
    if (this.$route.query.q) {
      this.searchText = this.$route.query.q
    }
  },
  watch: {
    '$route.query.q'(val) {
      this.searchText = val || ''
    }
  },
  data() {
    return {
      activeCategory: 'Todos',
      searchText: '',
      products: productos
    }
  },
  computed: {
    activeQuery() {
      return this.$route.query.q || ''
    },
    filteredProducts() {
      const q = this.searchText.trim().toLowerCase()
      return this.products.filter(p => {
        const byCategory = this.activeCategory === 'Todos' || p.category === this.activeCategory
        if (!q) return byCategory
        return byCategory && `${p.name} ${p.description}`.toLowerCase().includes(q)
      })
    }
  },
  methods: {
    async handleAddToCart(producto) {
      if (!this.authStore.isLoggedIn) {
        this.$router.push('/login')
        return
      }
      await this.cartStore.addItem(producto)
      this.showToast(`¡${producto.name} agregado al carrito!`)
    }
  }
}
</script>

<style scoped></style>
