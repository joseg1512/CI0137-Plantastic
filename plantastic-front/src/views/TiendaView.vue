<template>
  <section class="tienda-hero">
    <div class="hero-content tienda-hero-content">
      <h1 class="hero-title tienda-title">Nuestra tienda</h1>
      <p class="hero-subtitle tienda-subtitle">
        Descubre plantas y productos de belleza ecológica.
      </p>
    </div>
  </section>

  <section class="tienda-controls">
    <div class="filter-buttons">
      <button
        type="button"
        class="filter-btn"
        :class="{ 'filter-btn-active': activeCategory === 'Todos' }"
        @click="activeCategory = 'Todos'"
      >
        🌿 Todos
      </button>
      <button
        type="button"
        class="filter-btn"
        :class="{ 'filter-btn-active': activeCategory === 'PLANTA MEDICINAL' }"
        @click="activeCategory = 'PLANTA MEDICINAL'"
      >
        🌱 Plantas medicinales
      </button>
      <button
        type="button"
        class="filter-btn"
        :class="{ 'filter-btn-active': activeCategory === 'BELLEZA ECOLÓGICA' }"
        @click="activeCategory = 'BELLEZA ECOLÓGICA'"
      >
        🧴 Belleza ecológica
      </button>
    </div>

    <div class="search-wrapper">
      <input
        v-model="searchText"
        type="text"
        placeholder="Buscar productos..."
        class="search-input"
      >
      <span class="search-icon">🔍</span>
    </div>
  </section>

  <section class="tienda-products">
    <p class="results-count">{{ filteredProducts.length }} productos encontrados</p>

    <div class="products-grid">
      <ProductCard
        v-for="(product, index) in filteredProducts"
        :key="index"
        :badge="product.badge"
        :icon="product.icon"
        :category="product.category"
        :title="product.title"
        :description="product.description"
        :price="product.price"
      />
    </div>
  </section>
</template>

<script>
import ProductCard from '../components/ProductCard.vue'

export default {
  name: 'TiendaView',
  components: {
    ProductCard
  },
  data() {
    return {
      activeCategory: 'Todos',
      searchText: '',
      products: [
        {
          category: 'PLANTA MEDICINAL',
          title: 'Lavanda Orgánica',
          description: 'Ideal para relajación y mejor sueño',
          price: '₡5,800',
          icon: '🌿',
          badge: 'Bestseller'
        },
        {
          category: 'PLANTA MEDICINAL',
          title: 'Equinácea',
          description: 'Fortalece el sistema inmunológico',
          price: '₡6,200',
          icon: '🌸',
          badge: ''
        },
        {
          category: 'PLANTA MEDICINAL',
          title: 'Menta Piperita',
          description: 'Alivia problemas digestivos',
          price: '₡3,500',
          icon: '🍃',
          badge: ''
        },
        {
          category: 'BELLEZA ECOLÓGICA',
          title: 'Sérum Jojoba y Ricino',
          description: 'Hidratación profunda para rostro',
          price: '₡12,500',
          icon: '🧴',
          badge: ''
        },
        {
          category: 'BELLEZA ECOLÓGICA',
          title: 'Aceite Rosa Mosqueta',
          description: 'Regeneración celular y cicatrices',
          price: '₡15,900',
          icon: '💧',
          badge: 'Nuevo'
        }
      ]
    }
  },
  computed: {
    filteredProducts() {
      const normalizedSearch = this.searchText.trim().toLowerCase()

      return this.products.filter((product) => {
        const byCategory =
          this.activeCategory === 'Todos' || product.category === this.activeCategory

        if (!normalizedSearch) {
          return byCategory
        }

        const searchableText = `${product.title} ${product.description} ${product.category}`.toLowerCase()

        return byCategory && searchableText.includes(normalizedSearch)
      })
    }
  }
}
</script>

<style scoped>

</style>
