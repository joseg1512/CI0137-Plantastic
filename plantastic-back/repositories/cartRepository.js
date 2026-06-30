const { pool } = require('../config/database')

async function getCart(userId) {
  const result = await pool.query(
    `SELECT c.quantity, p.*
     FROM carrito c
     JOIN productos p ON p.id = c.producto_id
     WHERE c.usuario_id = $1
     ORDER BY p.name`,
    [userId]
  )
  return result.rows.map(row => ({
    id: row.slug,
    name: row.name,
    price: row.price,
    image: row.image,
    category: row.category,
    quantity: row.quantity,
    subtotal: row.price * row.quantity
  }))
}

async function addItem(userId, productSlug) {
  const product = await pool.query(
    'SELECT id FROM productos WHERE slug = $1',
    [productSlug]
  )
  if (product.rows.length === 0) return null

  await pool.query(
    `INSERT INTO carrito (usuario_id, producto_id, quantity)
     VALUES ($1, $2, 1)
     ON CONFLICT (usuario_id, producto_id)
     DO UPDATE SET quantity = carrito.quantity + 1`,
    [userId, product.rows[0].id]
  )
}

async function updateQuantity(userId, productSlug, quantity) {
  if (quantity <= 0) {
    await removeItem(userId, productSlug)
    return
  }

  const product = await pool.query(
    'SELECT id FROM productos WHERE slug = $1',
    [productSlug]
  )
  if (product.rows.length === 0) return

  await pool.query(
    `UPDATE carrito SET quantity = $1
     WHERE usuario_id = $2 AND producto_id = $3`,
    [quantity, userId, product.rows[0].id]
  )
}

async function removeItem(userId, productSlug) {
  const product = await pool.query(
    'SELECT id FROM productos WHERE slug = $1',
    [productSlug]
  )
  if (product.rows.length === 0) return

  await pool.query(
    'DELETE FROM carrito WHERE usuario_id = $1 AND producto_id = $2',
    [userId, product.rows[0].id]
  )
}

async function clearCart(userId) {
  await pool.query('DELETE FROM carrito WHERE usuario_id = $1', [userId])
}

module.exports = { getCart, addItem, updateQuantity, removeItem, clearCart }
