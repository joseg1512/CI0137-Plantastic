<template>
  <Navbar />
  <HeroSection />
  <OffersSection />
  <FeaturedProducts />
</template>

<script>
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import OffersSection from './components/OffersSection.vue'
import FeaturedProducts from './components/FeaturedProducts.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    HeroSection,
    OffersSection,
    FeaturedProducts
  }
}
</script>
