<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="footer-logo-row">
          <span class="footer-leaf">🌿</span>
          <span class="font-serif footer-brand-name">Plantastic</span>
        </div>
        <p>
          Naturaleza que sana. Productos botánicos de Costa Rica respaldados por la ciencia y el
          compromiso con la sostenibilidad.
        </p>
      </div>

      <div class="footer-column">
        <h3>Navegación</h3>
        <RouterLink to="/">Inicio</RouterLink>
        <RouterLink to="/tienda">Tienda</RouterLink>
        <RouterLink to="/guia">Guía Medicinal</RouterLink>
        <a href="#">Nosotros</a>
      </div>

      <div class="footer-column">
        <h3>Categorías</h3>
        <a href="/tienda">Plantas Medicinales</a>
        <a href="/tienda">Belleza Ecológica</a>
        <a href="/tienda">100% Orgánico</a>
      </div>

      <div class="footer-column">
        <h3>Contacto</h3>
        <a href="mailto:hola@plantastic.cr">hola@plantastic.cr</a>
        <span>San José, Costa Rica</span>
        <a href="tel:+50622223333">+506 2222-3333</a>
      </div>
    </div>

    <div class="footer-divider"></div>

    <p class="footer-copy">© 2026 Plantastic. Todos los derechos reservados.</p>
  </footer>
</template>

<script>
export default {
  name: 'FooterSection'
}
</script>

<style scoped>
/* Los estilos de la tarjeta se heredan styles.css */
</style>
