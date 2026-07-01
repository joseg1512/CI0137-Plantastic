const express = require('express')
const orderRepository = require('../repositories/orderRepository')
const cartRepository = require('../repositories/cartRepository')
const { pool } = require('../config/database')

const router = express.Router()

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Debes iniciar sesión' })
  }
  next()
}

router.get('/', requireAuth, async (req, res) => {
  try {
    const orders = await orderRepository.getOrdersByUser(req.session.user.id)
    res.json(orders)
  } catch (err) {
    console.error('Error en GET /api/orders:', err.message)
    res.status(500).json({ message: 'Error al obtener el historial.' })
  }
})

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const order = await orderRepository.getOrderById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Orden no encontrada.' })
    res.json(order)
  } catch (err) {
    console.error('Error en GET /api/orders/:id:', err.message)
    res.status(500).json({ message: 'Error al obtener la orden.' })
  }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const { subtotal, shipping, total, currency, transactionId, provincia, direccion, codigoPostal, phone } = req.body

    const cartItems = await cartRepository.getCart(req.session.user.id)
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío.' })
    }

    const items = await Promise.all(cartItems.map(async (item) => {
      const product = await pool.query('SELECT id FROM productos WHERE slug = $1', [item.id])
      return {
        producto_id: product.rows[0].id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }
    }))

    const order = await orderRepository.createOrder(req.session.user.id, {
      subtotal,
      shipping,
      total,
      currency,
      transactionId,
      provincia,
      direccion,
      codigoPostal,
      phone,
      items
    })

    res.status(201).json({ message: 'Orden creada.', orderId: order.id })
  } catch (err) {
    console.error('Error en POST /api/orders:', err.message)
    res.status(500).json({ message: 'Error al crear la orden.' })
  }
})

module.exports = router
