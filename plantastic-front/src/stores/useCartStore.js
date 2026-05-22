import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const itemCount = ref(0)
  const subtotal = ref(0)
  const shipping = ref(0)
  const total = ref(0)
  const isOpen = ref(false)

  function updateState(data) {
    items.value = data.items
    itemCount.value = data.itemCount
    subtotal.value = data.subtotal
    shipping.value = data.shipping
    total.value = data.total
  }

  async function fetchCart() {
    const res = await fetch('/api/cart')
    if (res.status === 401) { router.push('/login'); return }
    if (res.ok) updateState(await res.json())
  }

  async function addItem(producto) {
    const res = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: producto.id,
        name: producto.name,
        price: producto.price,
        image: producto.image,
        category: producto.category
      })
    })
    if (res.status === 401) { router.push('/login'); return }
    if (res.ok) updateState(await res.json())
  }

  async function updateQuantity(id, quantity) {
    const res = await fetch('/api/cart/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, quantity })
    })
    if (res.status === 401) { router.push('/login'); return }
    if (res.ok) updateState(await res.json())
  }

  async function removeItem(id) {
    const res = await fetch(`/api/cart/item/${id}`, { method: 'DELETE' })
    if (res.status === 401) { router.push('/login'); return }
    if (res.ok) updateState(await res.json())
  }

  async function clearCart() {
    const res = await fetch('/api/cart', { method: 'DELETE' })
    if (res.ok) updateState(await res.json())
  }

  function toggleDrawer() { isOpen.value = !isOpen.value }
  function openDrawer() { isOpen.value = true }
  function closeDrawer() { isOpen.value = false }

  return { items, itemCount, subtotal, shipping, total, isOpen, fetchCart, addItem, updateQuantity, removeItem, clearCart, toggleDrawer, openDrawer, closeDrawer }
})
