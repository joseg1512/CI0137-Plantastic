<template>
  <section class="ofrecemos">
    <h2 class="tag tag--lg tag--wide tag--bosque section-tag">LO QUE OFRECEMOS</h2>

    <div class="cards-container">
      <OfferCard
        v-for="(offer, index) in offers"
        :key="index"
        :icon="offer.icon"
        :title="offer.title"
        :description="offer.description"
      />
    </div>
  </section>
</template>

<script>
import OfferCard from './OfferCard.vue'

export default {
  name: 'OffersSection',
  components: {
    OfferCard
  },
  data() {
    return {
      offers: [
        {
          icon: '🌱',
          title: 'Plantas Medicinales',
          description: 'Hierbas cultivadas localmente con propiedades curativas probadas. Desde alivio del estrés hasta fortalecimiento inmunológico.'
        },
        {
          icon: '🧴',
          title: 'Belleza Ecológica',
          description: 'Productos de cuidado personal elaborados con aceites esenciales y extractos botánicos. Belleza natural, sin químicos.'
        }
      ]
    }
  }
}
</script>

<style scoped>
/* Las clases como .ofrecemos y .cards-container provienen de styles.css */
</style>
