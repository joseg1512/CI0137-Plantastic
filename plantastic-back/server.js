require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const sessionMiddleware = require('./config/session')
const sanitizeInputs = require('./config/sanitize')
const usersRouter = require('./routes/users')
const cartRouter = require('./routes/cart')
const productsRouter = require('./routes/products')
const paymentsRouter = require('./routes/payments')
const ordersRouter = require('./routes/orders')

const app = express()
const PORT = process.env.PORT || 3000

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:8080']

app.set('trust proxy', 1);

app.use(helmet())

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

app.use(express.json({ limit: '10kb' }))
app.use(sanitizeInputs)

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' }
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later.' }
})

app.use(globalLimiter)
app.use(sessionMiddleware)

app.get('/', (req, res) => {
  res.json({ message: '¡Bienvenid@ a Plantastic!' })
})

app.use('/api/users/login', authLimiter)
app.use('/api/users/register', authLimiter)

app.use('/api/users', usersRouter)
app.use('/api/cart', cartRouter)
app.use('/api/products', productsRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/orders', ordersRouter)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})

module.exports = app
