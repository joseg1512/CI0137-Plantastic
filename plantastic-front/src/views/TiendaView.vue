<template>
  <section class="tienda-hero">
    <div class="hero-content tienda-hero-content">
      <h1 class="hero-title tienda-title">Nuestra tienda</h1>
      <p class="hero-subtitle tienda-subtitle">
        Descubre plantas y productos de belleza ecologica.
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
        :class="{ 'filter-btn-active': activeCategory === 'BELLEZA ECOLOGICA' }"
        @click="activeCategory = 'BELLEZA ECOLOGICA'"
      >
        🧴 Belleza ecologica
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
          title: 'Lavanda Organica',
          description: 'Ideal para relajacion y mejor sueno',
          price: '₡5,800',
          icon: '🌿',
          badge: 'Bestseller'
        },
        {
          category: 'PLANTA MEDICINAL',
          title: 'Equinacea',
          description: 'Fortalece el sistema inmunologico',
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
          category: 'BELLEZA ECOLOGICA',
          title: 'Serum Jojoba y Ricino',
          description: 'Hidratacion profunda para rostro',
          price: '₡12,500',
          icon: '🧴',
          badge: ''
        },
        {
          category: 'BELLEZA ECOLOGICA',
          title: 'Aceite Rosa Mosqueta',
          description: 'Regeneracion celular y cicatrices',
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
