const { pool } = require('../config/database')

function toCamelCase(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    lastname: row.lastname,
    email: row.email,
    phone: row.phone,
    password: row.password,
    provincia: row.provincia,
    direccion: row.direccion,
    codigoPostal: row.codigo_postal
  }
}

async function findByEmail(email) {
  const result = await pool.query(
    'SELECT * FROM usuarios WHERE email = $1',
    [email]
  )
  return toCamelCase(result.rows[0])
}

async function create(user) {
  const result = await pool.query(
    `INSERT INTO usuarios (name, lastname, email, phone, password, provincia, direccion, codigo_postal)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [user.name, user.lastname, user.email, user.phone || '', user.password,
     user.provincia || '', user.direccion || '', user.codigoPostal || '']
  )
  return toCamelCase(result.rows[0])
}

function toSnakeCase(fields) {
  const mapped = {}
  if (fields.name !== undefined) mapped.name = fields.name
  if (fields.lastname !== undefined) mapped.lastname = fields.lastname
  if (fields.phone !== undefined) mapped.phone = fields.phone
  if (fields.provincia !== undefined) mapped.provincia = fields.provincia
  if (fields.direccion !== undefined) mapped.direccion = fields.direccion
  if (fields.codigoPostal !== undefined) mapped.codigo_postal = fields.codigoPostal
  return mapped
}

async function updateByEmail(email, fields) {
  const dbFields = toSnakeCase(fields)
  const sets = []
  const values = []
  let idx = 1

  for (const [key, value] of Object.entries(dbFields)) {
    sets.push(`${key} = $${idx}`)
    values.push(value)
    idx++
  }

  values.push(email)

  const result = await pool.query(
    `UPDATE usuarios SET ${sets.join(', ')} WHERE email = $${idx} RETURNING *`,
    values
  )
  return toCamelCase(result.rows[0])
}

module.exports = { findByEmail, create, updateByEmail }
