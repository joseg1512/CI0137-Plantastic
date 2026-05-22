import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)

  async function login(email, password) {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión')
    user.value = data.usuario
    return data
  }

  async function logout() {
    await fetch('/api/users/logout', { method: 'POST' })
    user.value = null
  }

  async function checkSession() {
    try {
      const res = await fetch('/api/users/me')
      if (res.ok) {
        user.value = await res.json()
      }
    } catch {
      // sin sesión activa
    }
  }

  return { user, isLoggedIn, login, logout, checkSession }
})
