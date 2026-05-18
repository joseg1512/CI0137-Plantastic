const express = require('express')
const cors = require('cors')
const usersRouter = require('./routes/users')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}))
app.use(express.json())

app.use('/api/users', usersRouter)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})

module.exports = app