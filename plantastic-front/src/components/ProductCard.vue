<template>
  <div class="card-base product-card">
    <div class="product-image-container">
      <span v-if="badge" class="product-badge">{{ badge }}</span>
      <span class="product-icon">{{ icon }}</span>
    </div>
    <div class="product-info">
      <span class="product-category">{{ category }}</span>
      <h4 class="font-serif product-title">{{ title }}</h4>
      <p class="product-desc">{{ description }}</p>
      <div class="product-footer">
        <span class="font-serif product-price">{{ price }}</span>
        <button class="add-to-cart-btn" @click.prevent="$emit('add-to-cart')">+</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    badge: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
/* Los estilos de la tarjeta se heredan styles.css */
</style>
