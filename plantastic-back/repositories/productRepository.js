const { pool } = require('../config/database')

function toFrontend(row) {
  return {
    id: row.slug,
    name: row.name,
    price: row.price,
    category: row.category,
    image: row.image,
    description: row.description,
    stock: row.stock
  }
}

async function findAll({ category, search } = {}) {
  const conditions = []
  const values = []
  let idx = 1

  if (category) {
    conditions.push(`category = $${idx}`)
    values.push(category)
    idx++
  }

  if (search) {
    conditions.push(`(name ILIKE $${idx} OR description ILIKE $${idx})`)
    values.push(`%${search}%`)
    idx++
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const result = await pool.query(
    `SELECT * FROM productos ${where} ORDER BY category, name`,
    values
  )
  return result.rows.map(toFrontend)
}

async function findBySlug(slug) {
  const result = await pool.query(
    'SELECT * FROM productos WHERE slug = $1',
    [slug]
  )
  return result.rows[0] ? toFrontend(result.rows[0]) : null
}

async function findById(id) {
  const result = await pool.query(
    'SELECT * FROM productos WHERE id = $1',
    [id]
  )
  return result.rows[0] ? toFrontend(result.rows[0]) : null
}

module.exports = { findAll, findBySlug, findById }
