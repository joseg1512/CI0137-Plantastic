<template>
  <section class="medical-guide" id="medical-guide-section">
    <div class="guide-header">
      <span class="tag tag--md tag--salvia guide-tag">GUÍA MEDICINAL</span>
      <h2 class="font-serif guide-title">¿Qué puedes tratar?</h2>
      <p class="guide-subtitle">Explora plantas medicinales organizadas por condición de salud</p>
    </div>

    <div class="conditions-grid">
      <button 
        class="condition-pill" 
        v-for="(condition, index) in conditions" 
        :key="index"
      >
        {{ condition }}
      </button>
    </div>

    <div class="guide-footer">
      <a href="#" class="btn btn-white">Ver guía completa &rarr;</a>
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
  name: 'MedicalGuide',
  data() {
    return {
      conditions: [
        'Alergias', 'Digestión', 'Estrés & Ansiedad', 'Dolores',
        'Inmunidad', 'Sueño', 'Piel', 'Respiratorio'
      ]
    }
  },
  methods: {
    scrollToNext() {
      const el = document.getElementById('featured-section')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>

<style scoped>

</style>
