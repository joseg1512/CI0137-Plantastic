<template>
  <nav class="navbar">
    <!-- Logo — left -->
    <div class="navbar-logo">
      <RouterLink to="/" class="logo">
        <img src="../assets/logo.png" alt="Logo Plantastic" style="height: 30px; width: auto;">
        Plantastic
      </RouterLink>
    </div>

    <!-- Center: nav links + search -->
    <div class="navbar-center">
      <ul class="nav-links">
        <li><RouterLink to="/" active-class="active" exact-active-class="active">Inicio</RouterLink></li>
        <li><RouterLink to="/tienda" active-class="active">Tienda</RouterLink></li>
        <li><RouterLink to="/guia" active-class="active">Guía Medicinal</RouterLink></li>
      </ul>

      <div class="navbar-search" ref="searchWrapper">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#717171" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar..."
          class="navbar-search-input"
          @keyup.enter="handleSearch"
          @input="handleInput"
        />
        <div v-if="showDropdown && suggestions.length" class="search-dropdown">
          <div
            v-for="item in suggestions"
            :key="item.id"
            class="search-suggestion"
            @click="selectSuggestion(item)"
          >
            <img :src="getImageSrc(item)" :alt="item.name" class="suggestion-img" />
            <span class="suggestion-name">{{ item.name }}</span>
            <span class="suggestion-price">₡{{ item.price.toLocaleString('es-CR') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: cart + user -->
    <div class="navbar-right">
      <button class="cart-btn" @click="handleCartClick">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <span v-if="cartStore.itemCount > 0" class="cart-badge">{{ cartStore.itemCount }}</span>
      </button>

      <template v-if="authStore.isLoggedIn">
        <button class="navbar-user-btn" @click="$router.push('/perfil')">
          <span class="user-avatar">{{ userInitial }}</span>
          <span class="navbar-username">{{ authStore.user.name }}</span>
        </button>
        <button class="navbar-logout-btn" @click="handleLogout">Cerrar sesión</button>
      </template>

      <template v-else>
        <RouterLink to="/login" class="navbar-auth-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Login
        </RouterLink>
        <RouterLink to="/registro" class="navbar-auth-link navbar-auth-link--reg">Registro</RouterLink>
      </template>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '@/stores/useAuthStore'
import { useCartStore } from '@/stores/useCartStore'
import { productos } from '@/data/productos.js'

export default {
  name: 'NavbarComponent',
  setup() {
    const authStore = useAuthStore()
    const cartStore = useCartStore()
    return { authStore, cartStore }
  },
  data() {
    return {
      searchQuery: '',
      showDropdown: false
    }
  },
  computed: {
    userInitial() {
      const name = this.authStore.user?.name || ''
      return name.charAt(0).toUpperCase() || '?'
    },
    suggestions() {
      const q = this.searchQuery.trim().toLowerCase()
      if (q.length < 2) return []
      return productos
        .filter(p => p.name.toLowerCase().includes(q))
        .slice(0, 6)
    }
  },
  watch: {
    suggestions(val) {
      this.showDropdown = val.length > 0
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  unmounted() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    handleClickOutside(e) {
      if (this.$refs.searchWrapper && !this.$refs.searchWrapper.contains(e.target)) {
        this.showDropdown = false
      }
    },
    handleInput() {
      if (this.searchQuery.trim().length < 2) {
        this.showDropdown = false
      }
    },
    selectSuggestion(item) {
      this.showDropdown = false
      this.searchQuery = ''
      this.$router.push({ path: '/tienda', query: { q: item.name } })
    },
    handleSearch() {
      const q = this.searchQuery.trim()
      this.showDropdown = false
      this.$router.push({ path: '/tienda', query: q ? { q } : {} })
    },
    handleCartClick() {
      if (!this.authStore.isLoggedIn) {
        this.$router.push('/login')
        return
      }
      this.cartStore.openDrawer()
    },
    async handleLogout() {
      await this.authStore.logout()
      this.$router.push('/login')
    },
    getImageSrc(item) {
      try {
        if (item.category === 'plantas') {
          return require(`@/assets/plantas/${item.image}.png`)
        }
        return require(`@/assets/productos/${item.image}.png`)
      } catch {
        return ''
      }
    }
  }
}
</script>

<style scoped>
.navbar {
  padding: 0 40px;
}

.navbar-logo {
  flex-shrink: 0;
}

.navbar-center {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
  justify-content: center;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.navbar-search {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #EDE8DC;
  border: 1px solid #C9DECC;
  border-radius: 20px;
  padding: 6px 14px;
  width: 200px;
  transition: border-color 0.2s;
}

.navbar-search:focus-within {
  border-color: #3A6644;
}

.navbar-search-input {
  background: none;
  border: none;
  outline: none;
  font-family: 'Jost', sans-serif;
  font-size: 14px;
  color: #1C1C1C;
  width: 100%;
}

.navbar-search-input::placeholder {
  color: #717171;
}

.search-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #F8F7F2;
  border: 1px solid #C9DECC;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  z-index: 1000;
  overflow: hidden;
}

.search-suggestion {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.15s;
}

.search-suggestion:hover {
  background: #EDE8DC;
}

.suggestion-img {
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
  background: #EDE8DC;
}

.suggestion-name {
  flex: 1;
  font-size: 0.85rem;
  color: #1C1C1C;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-price {
  font-size: 0.8rem;
  font-weight: 600;
  color: #3A6644;
  white-space: nowrap;
}

.cart-btn {
  position: relative;
  background-color: var(--color-bosque);
  color: var(--color-crema);
  border: none;
  padding: 8px 7px;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color var(--transition-default);
}

.cart-btn:hover { background-color: var(--color-salvia); }

.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #3A6644;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.navbar-user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #78A882;
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.navbar-username {
  color: #fff;
  font-size: 0.9rem;
  font-weight: 300;
}

.navbar-logout-btn {
  background: none;
  border: 1px solid rgba(255,255,255,0.3);
  color: var(--color-grafito);
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all var(--transition-default);
}

.navbar-logout-btn:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
}

.navbar-auth-link {
  color: var(--color-grafito);
  font-size: 0.9rem;
  font-weight: 300;
  transition: color var(--transition-default);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
}

.navbar-auth-link:hover { color: #fff; }

.navbar-auth-link--reg {
  background: #3A6644;
  color: #fff !important;
  padding: 6px 14px;
  border-radius: 4px;
  font-weight: 500;
  gap: 0;
}

.navbar-auth-link--reg:hover { background: #78A882; }

@media (max-width: 900px) {
  .navbar-search { display: none; }
}

@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
    padding: 15px 5%;
  }

  .navbar-center {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    flex: unset;
  }
}

@media (max-width: 480px) {
  .nav-links { flex-wrap: wrap; gap: 10px 18px; }
  .nav-links a { font-size: 0.85rem; }
  .navbar-username { display: none; }
}
</style>
