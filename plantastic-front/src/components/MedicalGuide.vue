<template>
  <section class="medical-guide">
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
  }
}
</script>

<style scoped>

</style>
