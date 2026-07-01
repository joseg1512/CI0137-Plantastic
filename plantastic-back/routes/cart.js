const express = require('express')
const cartRepository = require('../repositories/cartRepository')
const router = express.Router()

const SHIPPING = 2500

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Debes iniciar sesión para usar el carrito' })
  }
  next()
}

function buildResponse(items) {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const shipping = itemCount > 0 ? SHIPPING : 0
  return {
    items,
    itemCount,
    subtotal,
    shipping,
    total: subtotal + shipping
  }
}

router.get('/', requireAuth, async (req, res) => {
  try {
    const items = await cartRepository.getCart(req.session.user.id)
    res.json(buildResponse(items))
  } catch (err) {
    console.error('Error en GET /api/cart:', err.message)
    res.status(500).json({ message: 'Error al obtener el carrito.' })
  }
})

router.post('/add', requireAuth, async (req, res) => {
  try {
    const { id } = req.body
    if (!id) return res.status(400).json({ message: 'Datos del producto incompletos' })

    await cartRepository.addItem(req.session.user.id, id)
    const items = await cartRepository.getCart(req.session.user.id)
    res.json(buildResponse(items))
  } catch (err) {
    console.error('Error en POST /api/cart/add:', err.message)
    res.status(500).json({ message: 'Error al agregar al carrito.' })
  }
})

router.post('/update', requireAuth, async (req, res) => {
  try {
    const { id, quantity } = req.body
    if (!id || quantity == null) return res.status(400).json({ message: 'Datos incompletos' })

    await cartRepository.updateQuantity(req.session.user.id, id, quantity)
    const items = await cartRepository.getCart(req.session.user.id)
    res.json(buildResponse(items))
  } catch (err) {
    console.error('Error en POST /api/cart/update:', err.message)
    res.status(500).json({ message: 'Error al actualizar el carrito.' })
  }
})

router.delete('/item/:id', requireAuth, async (req, res) => {
  try {
    await cartRepository.removeItem(req.session.user.id, req.params.id)
    const items = await cartRepository.getCart(req.session.user.id)
    res.json(buildResponse(items))
  } catch (err) {
    console.error('Error en DELETE /api/cart/item:', err.message)
    res.status(500).json({ message: 'Error al eliminar del carrito.' })
  }
})

router.delete('/', requireAuth, async (req, res) => {
  try {
    await cartRepository.clearCart(req.session.user.id)
    res.json(buildResponse([]))
  } catch (err) {
    console.error('Error en DELETE /api/cart:', err.message)
    res.status(500).json({ message: 'Error al vaciar el carrito.' })
  }
})

module.exports = router
