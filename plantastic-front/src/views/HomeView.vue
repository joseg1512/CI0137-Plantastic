<template>
  <HeroSection />
  <OffersSection />
  <MedicalGuide />
  <FeaturedProducts />
</template>

<script>
import HeroSection from '../components/HeroSection.vue'
import OffersSection from '../components/OffersSection.vue'
import MedicalGuide from '../components/MedicalGuide.vue'
import FeaturedProducts from '../components/FeaturedProducts.vue'

export default {
  name: 'HomeView',
  components: {
    HeroSection,
    OffersSection,
    MedicalGuide,
    FeaturedProducts
  }
}
</script>
