<template>
  <Navbar />
  <router-view />
  <FooterSection />
</template>

<script>
import Navbar from './components/Navbar.vue'
import FooterSection from './components/FooterSection.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    FooterSection
  }
}
</script>
