const session = require('express-session')
// const { createClient } = require('redis')
// const { RedisStore } = require('connect-redis')

// const redisClient = createClient({
//   url: process.env.REDIS_URL
// })

// redisClient.connect().catch(console.error)

const sessionMiddleware = session({
  // store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'dev-secret',
  name: 'sid',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 1000 * 60 * 60 * 2  // 2 horas, en ms
  }
})

module.exports = sessionMiddleware