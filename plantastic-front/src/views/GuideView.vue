<template>
  <main class="guide-page">
    <section class="guide-hero">
      <span class="guide-kicker">GUIA MEDICINAL</span>
      <h1 class="guide-heading">Plantas organizadas por condición de salud</h1>
      <p class="guide-lead">Encuentra el remedio natural perfecto para tu necesidad específica</p>
    </section>

    <section class="guide-stats" aria-label="Estádísticas de la guía">
      <article class="stat-item">
        <p class="stat-value">30+</p>
        <p class="stat-label">Especies</p>
      </article>
      <article class="stat-item">
        <p class="stat-value">8</p>
        <p class="stat-label">Categorías</p>
      </article>
      <article class="stat-item">
        <p class="stat-value">100%</p>
        <p class="stat-label">Respaldo científico</p>
      </article>
      <article class="stat-item">
        <p class="stat-value">CR</p>
        <p class="stat-label">Cultivadas</p>
      </article>
    </section>

    <section class="guide-alert" aria-label="Aviso médico">
      <span class="alert-icon">⚕️</span>
      <p>
        <strong>Aviso médico:</strong> Está información es de carácter educativo y no sustituye el consejo médico
        profesional. Consulte con su médico antes de usar plantas medicinales, especialmente si está embarazada,
        amamantando o tomando medicamentos.
      </p>
    </section>

    <section class="guide-conditions" aria-label="Condiciones de salud">
      <div class="condition-column">
        <article
          v-for="condition in leftColumnConditions"
          :key="condition.title"
          class="condition-card"
          :class="{ 'condition-card-open': isExpanded(condition.title) }"
        >
          <button
            type="button"
            class="condition-header"
            :aria-expanded="isExpanded(condition.title)"
            :aria-label="`${isExpanded(condition.title) ? 'Cerrar' : 'Expandir'} ${condition.title}`"
            @click="toggleCondition(condition.title)"
          >
            <div class="condition-left">
              <span class="condition-icon">{{ condition.icon }}</span>
              <div class="condition-copy">
                <h2>{{ condition.title }}</h2>
                <p>{{ condition.count }} plantas recomendadas</p>
              </div>
            </div>
            <span class="condition-toggle" :class="{ 'condition-toggle-open': isExpanded(condition.title) }">⌄</span>
          </button>

          <div v-if="isExpanded(condition.title)" class="condition-details">
            <article v-for="plant in condition.plants" :key="plant.name" class="plant-item">
              <span class="plant-icon">{{ plant.icon }}</span>
              <div class="plant-copy">
                <h3>{{ plant.name }}</h3>
                <p>{{ plant.description }}</p>
              </div>
            </article>
          </div>
        </article>
      </div>

      <div class="condition-column">
        <article
          v-for="condition in rightColumnConditions"
          :key="condition.title"
          class="condition-card"
          :class="{ 'condition-card-open': isExpanded(condition.title) }"
        >
          <button
            type="button"
            class="condition-header"
            :aria-expanded="isExpanded(condition.title)"
            :aria-label="`${isExpanded(condition.title) ? 'Cerrar' : 'Expandir'} ${condition.title}`"
            @click="toggleCondition(condition.title)"
          >
            <div class="condition-left">
              <span class="condition-icon">{{ condition.icon }}</span>
              <div class="condition-copy">
                <h2>{{ condition.title }}</h2>
                <p>{{ condition.count }} plantas recomendadas</p>
              </div>
            </div>
            <span class="condition-toggle" :class="{ 'condition-toggle-open': isExpanded(condition.title) }">⌄</span>
          </button>

          <div v-if="isExpanded(condition.title)" class="condition-details">
            <article v-for="plant in condition.plants" :key="plant.name" class="plant-item">
              <span class="plant-icon">{{ plant.icon }}</span>
              <div class="plant-copy">
                <h3>{{ plant.name }}</h3>
                <p>{{ plant.description }}</p>
              </div>
            </article>
          </div>
        </article>
      </div>
    </section>

    <section class="guide-cta">
      <h2>¿Listo para comenzar tu sanación natural?</h2>
      <p>Explora nuestra tienda y encuentra los productos perfectos para ti</p>
      <RouterLink to="/tienda" class="guide-cta-button">Ir a la tienda →</RouterLink>
    </section>
  </main>
</template>

<script>
export default {
  name: 'GuideView',
  data() {
    return {
      expandedConditions: [],
      conditions: [
        {
          title: 'Alergias',
          icon: '🌸',
          count: 4,
          plants: [
            {
              name: 'Ortiga',
              icon: '🍃',
              description: 'Antihistamínico natural que reduce los síntomas de alergias estacionales.'
            },
            {
              name: 'Menta',
              icon: '🌿',
              description: 'Descongestionante que alivia la congestión nasal y los ojos llorosos.'
            },
            {
              name: 'Jengibre',
              icon: '🫚',
              description: 'Propiedades antiinflamatorias que reducen la respuesta alérgica.'
            },
            {
              name: 'Manzanilla',
              icon: '🌼',
              description: 'Calma las reacciones alérgicas de la piel y reduce la inflamación.'
            }
          ]
        },
        {
          title: 'Digestión',
          icon: '🌿',
          count: 4,
          plants: [
            {
              name: 'Menta Piperita',
              icon: '🍃',
              description: 'Alivia el síndrome de intestino irritable y reduce la hinchazón.'
            },
            {
              name: 'Jengibre',
              icon: '🫚',
              description: 'Reduce náuseas, mejora la digestión y alivia el malestar estomacal.'
            },
            {
              name: 'Manzanilla',
              icon: '🌼',
              description: 'Calma el estómago irritado y reduce la inflamación digestiva.'
            },
            {
              name: 'Hinojo',
              icon: '🌿',
              description: 'Reduce gases y mejora la digestión después de comidas pesadas.'
            }
          ]
        },
        {
          title: 'Estrés & Ansiedad',
          icon: '🍃',
          count: 4,
          plants: [
            {
              name: 'Lavanda',
              icon: '🌿',
              description: 'Reduce la ansiedad y promueve una sensación de calma profunda.'
            },
            {
              name: 'Manzanilla',
              icon: '🌼',
              description: 'Ansiolítico suave que calma los nervios sin causar somnolencia.'
            },
            {
              name: 'Ashwagandha',
              icon: '🌱',
              description: 'Adaptógeno que ayuda al cuerpo a manejar el estrés crónico.'
            },
            {
              name: 'Pasiflora',
              icon: '🌿',
              description: 'Reduce la ansiedad y mejora el estado de ánimo naturalmente.'
            }
          ]
        },
        {
          title: 'Dolores & Inflamación',
          icon: '💚',
          count: 4,
          plants: [
            {
              name: 'Cúrcuma',
              icon: '🍃',
              description: 'Antiinflamatorio potente, tan efectivo como algunos medicamentos.'
            },
            {
              name: 'Jengibre',
              icon: '🫚',
              description: 'Alivia dolores musculares y reduce la inflamación articular.'
            },
            {
              name: 'Sauce Blanco',
              icon: '🌿',
              description: 'Contiene salicina, precursor natural de la aspirina.'
            },
            {
              name: 'Árnica',
              icon: '🌸',
              description: 'Uso tópico para moretones, esguinces y dolores musculares.'
            }
          ]
        },
        {
          title: 'Sistema Inmune',
          icon: '✨',
          count: 4,
          plants: [
            {
              name: 'Equinácea',
              icon: '🌸',
              description: 'Estimula el sistema inmune y reduce la duración de resfriados.'
            },
            {
              name: 'Jengibre',
              icon: '🫚',
              description: 'Propiedades antimicrobianas que fortalecen las defensas.'
            },
            {
              name: 'Saúco',
              icon: '🌿',
              description: 'Rico en antioxidantes, combate virus y bacterias.'
            },
            {
              name: 'Astrágalo',
              icon: '🌱',
              description: 'Adaptógeno que fortalece la resistencia a enfermedades.'
            }
          ]
        },
        {
          title: 'Sueño',
          icon: '🌙',
          count: 4,
          plants: [
            {
              name: 'Valeriana',
              icon: '🌿',
              description: 'Inductor natural del sueño que mejora la calidad del descanso.'
            },
            {
              name: 'Lavanda',
              icon: '💜',
              description: 'Promueve relajación y facilita conciliar el sueño.'
            },
            {
              name: 'Manzanilla',
              icon: '🌼',
              description: 'Sedante suave que calma la mente antes de dormir.'
            },
            {
              name: 'Pasiflora',
              icon: '🌿',
              description: 'Mejora la calidad del sueño y reduce despertares nocturnos.'
            }
          ]
        }
      ]
    }
  },
  computed: {
    leftColumnConditions() {
      return this.conditions.filter((_, index) => index % 2 === 0)
    },
    rightColumnConditions() {
      return this.conditions.filter((_, index) => index % 2 !== 0)
    }
  },
  methods: {
    toggleCondition(title) {
      if (this.expandedConditions.includes(title)) {
        this.expandedConditions = this.expandedConditions.filter((conditionTitle) => conditionTitle !== title)
        return
      }

      this.expandedConditions = [...this.expandedConditions, title]
    },
    isExpanded(title) {
      return this.expandedConditions.includes(title)
    }
  }
}
</script>
