<template>
  <nav class="navbar">
    <a href="#" class="logo">
      <!-- Ajustamos la ruta para que webpack la resuelva correctamente -->
      <img src="../assets/logo.png" alt="Logo Plantastic" style="height: 30px; width: auto;">
      Plantastic
    </a>

    <ul class="nav-links">
      <li><a href="#" class="active">Inicio</a></li>
      <li><a href="#">Tienda</a></li>
      <li><a href="#">Guía Medicinal</a></li>
      <li><a href="#">Nosotros</a></li>
    </ul>

    <button class="cart-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      <span class="contador">0</span>
    </button>
  </nav>
</template>

<script>
export default {
  name: 'NavbarComponent'
}
</script>

<style scoped>
/* Los estilos se heredan de styles.css global */
</style>