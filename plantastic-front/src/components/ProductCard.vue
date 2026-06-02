<template>
  <div class="card-base product-card">
    <div class="product-image-container">
      <span v-if="badge || (product && product.badge)" class="product-badge">{{ badge || product.badge }}</span>
      <img v-if="product && product.image" :src="getImageSrc()" :alt="product.name" class="product-img" />
      <span v-else class="product-icon">{{ icon }}</span>
    </div>
    <div class="product-info">
      <span class="product-category">{{ displayCategory }}</span>
      <h4 class="font-serif product-title">{{ displayTitle }}</h4>
      <p class="product-desc">{{ displayDescription }}</p>
      <div class="product-footer">
        <span class="font-serif product-price">{{ displayPrice }}</span>
        <button class="add-to-cart-btn" @click.prevent="handleAddToCart">+</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    badge: { type: String, default: '' },
    icon: { type: String, default: '' },
    category: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    price: { type: [String, Number], default: '' },
    product: { type: Object, default: null }
  },
  emits: ['add-to-cart'],
  computed: {
    displayTitle() { return this.product ? this.product.name : this.title },
    displayCategory() {
      if (this.product) return this.product.category === 'plantas' ? 'PLANTA MEDICINAL' : 'BELLEZA ECOLÓGICA'
      return this.category
    },
    displayDescription() { return this.product ? this.product.description : this.description },
    displayPrice() {
      const p = this.product ? this.product.price : this.price
      if (typeof p === 'number') return `₡${p.toLocaleString('es-CR')}`
      return p
    }
  },
  methods: {
    getImageSrc() {
      if (!this.product || !this.product.image) return ''
      if (this.product.category === 'plantas') {
        return require(`@/assets/plantas/${this.product.image}.png`)
      }
      return require(`@/assets/productos/${this.product.image}.png`)
    },
    handleAddToCart() {
      this.$emit('add-to-cart', this.product)
    }
  }
}
</script>

<style scoped>
.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
