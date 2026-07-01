const express = require('express')
const productRepository = require('../repositories/productRepository')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { category, q } = req.query
    const productos = await productRepository.findAll({ category, search: q })
    res.json(productos)
  } catch (err) {
    console.error('Error en GET /api/products:', err.message)
    res.status(500).json({ message: 'Error al obtener productos.' })
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const producto = await productRepository.findBySlug(req.params.slug)
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado.' })
    res.json(producto)
  } catch (err) {
    console.error('Error en GET /api/products/:slug:', err.message)
    res.status(500).json({ message: 'Error al obtener el producto.' })
  }
})

module.exports = router
