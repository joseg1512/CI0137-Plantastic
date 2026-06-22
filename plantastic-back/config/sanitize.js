function sanitizeValue(value) {
  if (typeof value === 'string') {
    return value.replace(/<[^>]*>/g, '').slice(0, 1000)
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue)
  }
  if (value !== null && typeof value === 'object') {
    return sanitizeObject(value)
  }
  return value
}

function sanitizeObject(obj) {
  const clean = {}
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) continue
    clean[key] = sanitizeValue(obj[key])
  }
  return clean
}

function sanitizeInputs(req, _res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body)
  }
  next()
}

module.exports = sanitizeInputs
