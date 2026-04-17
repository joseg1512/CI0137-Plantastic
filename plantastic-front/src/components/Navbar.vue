<template>
  <nav class="navbar">
    <RouterLink to="/" class="logo">
      <!-- Ajustamos la ruta para que webpack la resuelva correctamente -->
      <img src="../assets/logo.png" alt="Logo Plantastic" style="height: 30px; width: auto;">
      Plantastic
    </RouterLink>

    <ul class="nav-links">
      <li><RouterLink to="/" active-class="active" exact-active-class="active">Inicio</RouterLink></li>
      <li><RouterLink to="/tienda" active-class="active">Tienda</RouterLink></li>
      <li><RouterLink to="/guia" active-class="active">Guía Medicinal</RouterLink></li>
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

@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
    justify-content: space-between;
    height: auto;
    padding: 15px 5%;
  }

  .nav-links {
    order: 3;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 15px;
    padding-top: 25px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
  }
}

@media (max-width: 480px) {
  .nav-links {
    flex-wrap: wrap;
    gap: 10px 18px;
  }

  .nav-links a {
    font-size: 0.85rem;
  }
}
</style>