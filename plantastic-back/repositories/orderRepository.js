const { pool } = require('../config/database')

async function createOrder(userId, { subtotal, shipping, total, currency, transactionId, provincia, direccion, codigoPostal, phone, items }) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const orderResult = await client.query(
      `INSERT INTO ordenes (usuario_id, subtotal, shipping, total, currency, transaction_id, provincia, direccion, codigo_postal, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [userId, subtotal, shipping || 2500, total, currency || 'colones', transactionId, provincia || '', direccion || '', codigoPostal || '', phone || '']
    )

    const orderId = orderResult.rows[0].id

    for (const item of items) {
      await client.query(
        `INSERT INTO detalle_ordenes (orden_id, producto_id, product_name, unit_price, quantity, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.producto_id, item.name, item.price, item.quantity, item.price * item.quantity]
      )
    }

    await client.query('DELETE FROM carrito WHERE usuario_id = $1', [userId])

    await client.query('COMMIT')

    const row = orderResult.rows[0]
    return {
      ...row,
      codigoPostal: row.codigo_postal,
      transactionId: row.transaction_id
    }
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

async function getOrdersByUser(userId) {
  const result = await pool.query(
    `SELECT o.*,
            COALESCE(
              json_agg(json_build_object(
                'product_name', d.product_name,
                'unit_price', d.unit_price,
                'quantity', d.quantity,
                'subtotal', d.subtotal
              )) FILTER (WHERE d.orden_id IS NOT NULL),
              '[]'::json
            ) AS items
     FROM ordenes o
     LEFT JOIN detalle_ordenes d ON d.orden_id = o.id
     WHERE o.usuario_id = $1
     GROUP BY o.id
     ORDER BY o.id DESC`,
    [userId]
  )
  return result.rows.map(row => ({
    id: row.id,
    usuario_id: row.usuario_id,
    subtotal: row.subtotal,
    shipping: row.shipping,
    total: row.total,
    currency: row.currency,
    transactionId: row.transaction_id,
    estado: row.estado,
    provincia: row.provincia,
    direccion: row.direccion,
    codigoPostal: row.codigo_postal,
    phone: row.phone,
    items: row.items
  }))
}

async function getOrderById(orderId) {
  const result = await pool.query(
    `SELECT o.*,
            COALESCE(
              json_agg(json_build_object(
                'product_name', d.product_name,
                'unit_price', d.unit_price,
                'quantity', d.quantity,
                'subtotal', d.subtotal
              )) FILTER (WHERE d.orden_id IS NOT NULL),
              '[]'::json
            ) AS items
     FROM ordenes o
     LEFT JOIN detalle_ordenes d ON d.orden_id = o.id
     WHERE o.id = $1
     GROUP BY o.id`,
    [orderId]
  )
  if (!result.rows[0]) return null

  const row = result.rows[0]
  return {
    id: row.id,
    usuario_id: row.usuario_id,
    subtotal: row.subtotal,
    shipping: row.shipping,
    total: row.total,
    currency: row.currency,
    transactionId: row.transaction_id,
    estado: row.estado,
    provincia: row.provincia,
    direccion: row.direccion,
    codigoPostal: row.codigo_postal,
    phone: row.phone,
    items: row.items
  }
}

module.exports = { createOrder, getOrdersByUser, getOrderById }
