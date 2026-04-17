<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="footer-logo-row">
          <span class="footer-leaf">🌿</span>
          <span class="footer-brand-name">Plantastic</span>
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
.site-footer {
  background: var(--color-bosque);
  color: var(--color-crema);
  padding: 64px 10% 32px;
}

.footer-inner {
  display: grid;
  grid-template-columns: 1.4fr repeat(3, minmax(140px, 1fr));
  gap: 48px;
  align-items: start;
}

.footer-brand {
  max-width: 280px;
}

.footer-logo-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.footer-leaf {
  font-size: 1.4rem;
}

.footer-brand-name {
  font-family: 'Georgia', serif;
  color: var(--color-crema);
  font-size: 1.6rem;
}

.footer-brand p {
  margin: 0;
  line-height: 1.7;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.footer-column h3 {
  margin: 0 0 6px;
  color: var(--color-crema);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.92rem;
}

.footer-column a,
.footer-column span {
  color: var(--color-crema);
  text-decoration: none;
  line-height: 1.5;
}

.footer-column a:hover {
  color: var(--color-salvia);
}

.footer-divider {
  height: 1px;
  background: rgba(237, 232, 220, 0.18);
  margin: 44px 0 18px;
}

.footer-copy {
  margin: 0;
  text-align: center;
  color: var(--color-grafito);
}

@media (max-width: 900px) {
  .footer-inner {
    grid-template-columns: 1fr 1fr;
  }

  .footer-brand {
    max-width: none;
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .site-footer {
    padding: 56px 7% 28px;
  }

  .footer-inner {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .footer-divider {
    margin-top: 36px;
  }
}
</style>