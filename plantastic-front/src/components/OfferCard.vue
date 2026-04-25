<template>
  <div class="card">
    <span class="card-icon">{{ icon }}</span>
    <a href="#" class="card-title">{{ title }}</a>
    <p class="card-text">{{ description }}</p>
  </div>
</template>

<script>
export default {
  name: 'OfferCard',
  props: {
    icon: {
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
    }
  }
}
</script>

<style scoped>
/* Estilos heredados */
</style>
