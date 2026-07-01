import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore('products', () => {
  const products = ref([])
  const loading = ref(false)

  async function fetchProducts({ category, search } = {}) {
    loading.value = true
    try {
      const params = new URLSearchParams()
      if (category) params.set('category', category)
      if (search) params.set('q', search)

      const url = `/api/products${params.toString() ? '?' + params.toString() : ''}`
      const res = await fetch(url)
      if (res.ok) products.value = await res.json()
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      loading.value = false
    }
  }

  return { products, loading, fetchProducts }
})
