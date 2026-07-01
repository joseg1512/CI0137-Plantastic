const express = require('express')
const https = require('https')

const router = express.Router()
const BINCHECK_URL = 'https://bincheck.org/costa-rica'
const BIN_CACHE_TTL_MS = 60 * 60 * 1000
let cachedBins = null
let cachedAt = 0

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function stripDigits(value) {
  return String(value || '').replace(/\D/g, '')
}

function detectBrand(cardNumber) {
  if (/^3[47]/.test(cardNumber)) return 'amex'
  if (/^4/.test(cardNumber)) return 'visa'
  if (/^5[1-5]/.test(cardNumber) || /^2[2-7]/.test(cardNumber)) return 'mastercard'
  return ''
}

function expectedCardLength(brand) {
  if (brand === 'amex') return 15
  if (brand === 'visa' || brand === 'mastercard') return 16
  return 0
}

function expectedCvcLength(brand) {
  if (brand === 'amex') return 4
  if (brand === 'visa' || brand === 'mastercard') return 3
  return 0
}

function parseExpiry(expiry) {
  const match = String(expiry || '').trim().match(/^(\d{2})\/(\d{2})$/)
  if (!match) return null

  const month = Number(match[1])
  const year = 2000 + Number(match[2])

  if (month < 1 || month > 12) return null

  return { month, year }
}

function normalizeCurrency(value) {
  const normalized = normalizeText(value)
  if (['colones', 'colon', 'crc'].includes(normalized)) return 'colones'
  if (['dolares', 'dolar', 'usd', 'dollars'].includes(normalized)) return 'dolares'
  return ''
}

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { headers: { 'user-agent': 'Plantastic/1.0' } }, response => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume()
        resolve(fetchHtml(response.headers.location))
        return
      }

      if (response.statusCode !== 200) {
        response.resume()
        reject(new Error(`Unexpected status ${response.statusCode}`))
        return
      }

      let body = ''
      response.setEncoding('utf8')
      response.on('data', chunk => { body += chunk })
      response.on('end', () => resolve(body))
    })

    request.on('error', reject)
    request.setTimeout(10000, () => request.destroy(new Error('BINCheck request timed out')))
  })
}

function extractBins(html) {
  const bins = new Set()
  const tableCellPattern = /<td[^>]*>\s*(\d{6})\s*<\/td>/gi
  let match = null

  while ((match = tableCellPattern.exec(html)) !== null) {
    bins.add(match[1])
  }

  if (bins.size === 0) {
    const fallbackPattern = /\b(\d{6})\b/g
    while ((match = fallbackPattern.exec(html)) !== null) {
      bins.add(match[1])
    }
  }

  return bins
}

async function getCostaRicaBins() {
  const freshCache = cachedBins && (Date.now() - cachedAt) < BIN_CACHE_TTL_MS
  if (freshCache) {
    return cachedBins
  }

  const html = await fetchHtml(BINCHECK_URL)
  const bins = extractBins(html)
  cachedBins = bins
  cachedAt = Date.now()
  return bins
}

function validateExpiry(expiry) {
  const parsed = parseExpiry(expiry)
  if (!parsed) {
    return 'La fecha de vencimiento debe tener formato MM/AA.'
  }

  const expiryDate = new Date(parsed.year, parsed.month, 0, 23, 59, 59, 999)
  const minimumValidDate = new Date()
  minimumValidDate.setMonth(minimumValidDate.getMonth() + 1)
  minimumValidDate.setDate(0)
  minimumValidDate.setHours(0, 0, 0, 0)

  if (expiryDate < minimumValidDate) {
    return 'La tarjeta debe vencer al menos un mes después de hoy.'
  }

  return null
}

router.post('/', async (req, res) => {
  try {
    const cardNumber = stripDigits(req.body.cardNumber)
    const holder = String(req.body.holder || '').trim()
    const expiry = req.body.expiry
    const cvc = stripDigits(req.body.cvc ?? req.body.cvv)
    const currency = normalizeCurrency(req.body.currency)
    const amount = Number(req.body.amount)

    const reasons = []

    if (!cardNumber) {
      reasons.push('El número de tarjeta es obligatorio.')
    }

    const brand = detectBrand(cardNumber)
    if (!brand) {
      reasons.push('Solo se aceptan tarjetas Visa, Mastercard o Amex.')
    }

    const requiredLength = expectedCardLength(brand)
    if (requiredLength && cardNumber.length !== requiredLength) {
      reasons.push(`La tarjeta debe tener ${requiredLength} dígitos.`)
    }

    if (!holder) {
      reasons.push('El titular de la tarjeta es obligatorio.')
    }

    const expiryError = validateExpiry(expiry)
    if (expiryError) {
      reasons.push(expiryError)
    }

    const cvcLength = expectedCvcLength(brand)
    if (cvcLength && cvc.length !== cvcLength) {
      reasons.push(`El CVC debe tener ${cvcLength} dígitos.`)
    }

    if (!currency) {
      reasons.push('La moneda debe ser colones o dólares.')
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      reasons.push('El monto debe ser mayor que cero.')
    }

    const bin = cardNumber.slice(0, 6)
    if (bin.length === 6 && process.env.NODE_ENV === 'production') {
      try {
        const bins = await getCostaRicaBins()
        if (bins.size > 0 && !bins.has(bin)) {
          reasons.push('El BIN de la tarjeta no corresponde a Costa Rica.')
        }
      } catch (_) {}
    }

    if (reasons.length > 0) {
      return res.status(200).json({
        flag: 'rejected',
        approved: false,
        message: 'Pago rechazado',
        reasons
      })
    }

    // if (req.session) {
    //   req.session.cart = []
    // }

    return res.status(200).json({
      flag: 'approved',
      approved: true,
      message: 'Pago aprobado',
      transactionId: `PAY-${Date.now()}`,
      bin,
      brand,
      currency
    })
  } catch (error) {
    console.error('Error en POST /api/payments:', error)
    return res.status(503).json({
      flag: 'rejected',
      approved: false,
      message: 'No se pudo validar el BIN en este momento.'
    })
  }
})

module.exports = router