const express = require('express')
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

router.get('/', requireAuth, (req, res) => {
  const items = req.session.cart || []
  res.json(buildResponse(items))
})

router.post('/add', requireAuth, (req, res) => {
  const { id, name, price, image, category } = req.body
  if (!id || !name || price == null) {
    return res.status(400).json({ message: 'Datos del producto incompletos' })
  }
  const cart = req.session.cart || []
  const existing = cart.find(item => item.id === id)
  if (existing) {
    existing.quantity += 1
    existing.subtotal = existing.price * existing.quantity
  } else {
    cart.push({ id, name, price, image, category, quantity: 1, subtotal: price })
  }
  req.session.cart = cart
  res.json(buildResponse(cart))
})

router.post('/update', requireAuth, (req, res) => {
  const { id, quantity } = req.body
  if (!id || quantity == null) {
    return res.status(400).json({ message: 'Datos incompletos' })
  }
  let cart = req.session.cart || []
  if (quantity <= 0) {
    cart = cart.filter(item => item.id !== id)
  } else {
    const item = cart.find(item => item.id === id)
    if (item) {
      item.quantity = quantity
      item.subtotal = item.price * quantity
    }
  }
  req.session.cart = cart
  res.json(buildResponse(cart))
})

router.delete('/item/:id', requireAuth, (req, res) => {
  const { id } = req.params
  const cart = (req.session.cart || []).filter(item => item.id !== id)
  req.session.cart = cart
  res.json(buildResponse(cart))
})

router.delete('/', requireAuth, (req, res) => {
  req.session.cart = []
  res.json(buildResponse([]))
})

module.exports = router
