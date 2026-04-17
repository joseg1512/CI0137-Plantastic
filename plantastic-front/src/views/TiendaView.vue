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
.tienda-hero {
  min-height: 320px;
  padding: 40px 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: var(--color-circle);
}

.tienda-hero-content {
  max-width: 760px;
  margin: 0 auto;
}

.tienda-title {
  margin-bottom: 16px;
}

.tienda-subtitle {
  max-width: 100%;
  margin: 0 auto;
}

.tienda-controls {
  padding: 40px 10% 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
}

.filter-btn {
  background: #fff;
  color: var(--color-bosque);
  border: 2px solid rgba(116, 116, 116, 0.25);
  border-radius: 999px;
  padding: 12px 22px;
  font-family: var(--font-principal);
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.filter-btn-active {
  background: var(--color-bosque);
  color: #ede8dc;
  border-color: var(--color-bosque);
}

.search-wrapper {
  width: min(100%, 580px);
  position: relative;
}

.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 16px 52px 16px 18px;
  border: 2px solid rgba(116, 116, 116, 0.25);
  border-radius: 12px;
  font-family: var(--font-principal);
  font-size: 1rem;
  color: var(--color-grafito);
  background: #fff;
  outline: none;
  box-shadow: 0 2px 10px rgba(116, 116, 116, 0.08);
}

.search-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #747474;
  pointer-events: none;
}

.tienda-products {
  padding: 10px 10% 70px;
}

.results-count {
  text-align: center;
  color: #747474;
  margin: 0 0 30px;
  font-size: 1rem;
}

.products-grid {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.products-grid :deep(.product-card) {
  max-width: 100%;
}
</style>
