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
    <button class="scroll-arrow" @click="scrollToNext" aria-label="Desplazar hacia abajo">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <polyline points="19 12 12 19 5 12"/>
      </svg>
    </button>
  </section>
</template>

<script>
export default {
  name: 'HeroSection',
  methods: {
    scrollToNext() {
      const el = document.getElementById('medical-guide-section')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>

<style scoped>
/* Los estilos se heredan de styles.css */
</style>
