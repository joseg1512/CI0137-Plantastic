<template>
  <section class="productos-destacados">
    <h2 class="section-tag center">PRODUCTOS DESTACADOS</h2>
    <h3 class="section-title">Lo más popular</h3>

    <div class="products-container">
      <ProductCard
        v-for="(product, index) in products"
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
import ProductCard from './ProductCard.vue';

export default {
  name: 'FeaturedProducts',
  components: {
    ProductCard
  },
  data() {
    return {
      products: [
        {
          badge: 'Bestseller',
          icon: '🌿',
          category: 'PLANTA MEDICINAL',
          title: 'Lavanda Orgánica',
          description: 'Ideal para relajación y mejor sueño',
          price: '₡5,800'
        },
        {
          badge: '',
          icon: '🧴',
          category: 'BELLEZA ECOLÓGICA',
          title: 'Sérum Jojoba & Ricino',
          description: 'Hidratación profunda para rostro',
          price: '₡12,500'
        },
        {
          badge: '',
          icon: '🌸',
          category: 'PLANTA MEDICINAL',
          title: 'Equinácea',
          description: 'Fortalece el sistema inmunológico',
          price: '₡6,200'
        },
        {
          badge: 'Nuevo',
          icon: '🧴',
          category: 'BELLEZA ECOLÓGICA',
          title: 'Aceite Rosa Mosqueta',
          description: 'Regeneración celular y cicatrices',
          price: '₡15,900'
        }
      ]
    }
  }
}
</script>
