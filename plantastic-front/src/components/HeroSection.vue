<template>
  <section class="hero">
    <div class="hero-content">
      <span class="tag tag--md tag--bosque">NATURALEZA QUE SANA</span>
      <h1 class="font-serif hero-title">La naturaleza tiene una <span class="highlight">cura</span> para todo</h1>
      <p class="hero-subtitle">Descubre el poder de las plantas medicinales de Costa Rica. Respaldo científico,
        100% orgánico, cultivado con amor.</p>
      <div class="hero-buttons">
        <RouterLink to="/tienda" class="btn btn-primary">Explorar tienda &rarr;</RouterLink>
        <RouterLink to="/guia" class="btn btn-outline">Guía medicinal</RouterLink>
      </div>
    </div>
    <div class="hero-visual">
      <div class="circle-bg">
        <span class="leaf-icon">🌿</span>
      </div>
      <div class="badge badge-1">
        <span>🌱</span> 100% Orgánico
      </div>
      <div class="badge badge-2">
        <span>🔬</span> Respaldo científico
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection'
}
</script>

<style scoped>
/* Los estilos se heredan de styles.css */
</style>
