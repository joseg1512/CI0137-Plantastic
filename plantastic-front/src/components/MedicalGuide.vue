<template>
  <section class="medical-guide">
    <div class="guide-header">
      <span class="guide-tag">GUÍA MEDICINAL</span>
      <h2 class="guide-title">¿Qué puedes tratar?</h2>
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
.medical-guide {
  background-color: var(--color-navbar-green);
  color: #fff;
  padding: 100px 10%;
  text-align: center;
}

.guide-tag {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-salvia);
  display: block;
  margin-bottom: 20px;
}

.guide-title {
  font-family: 'Georgia', serif;
  font-size: 2.8rem;
  font-weight: 400;
  margin: 0 0 15px 0;
  color: #fff;
}

.guide-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 60px;
  font-weight: 300;
}

.conditions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  max-width: 900px;
  margin: 0 auto 50px auto;
}

.condition-pill {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 16px 20px;
  border-radius: 6px;
  font-family: var(--font-principal);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.condition-pill:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.3);
}

.btn-white {
  background-color: #fff;
  color: var(--color-navbar-green);
  font-weight: 600;
  display: inline-block;
  font-family: var(--font-principal);
  padding: 14px 28px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.95rem;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.btn-white:hover {
  background-color: var(--color-crema);
}
</style>
