const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')
const { createObjectCsvWriter } = require('csv-writer')

const CSV_PATH = path.join(__dirname, '../data/Users.csv')
const HEADERS = ['name', 'lastname', 'email', 'phone', 'password', 'provincia', 'direccion', 'codigoPostal']

function readUsers() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(CSV_PATH)) {
      return resolve([])
    }

    const users = []
    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on('data', (row) => users.push(row))
      .on('end', () => resolve(users))
      .on('error', (err) => reject(err))
  })
}

async function writeUsers(users) {
  const writer = createObjectCsvWriter({
    path: CSV_PATH,
    header: HEADERS.map(id => ({ id, title: id }))
  })
  await writer.writeRecords(users)
}

async function addUser(user) {
  const existentes = await readUsers()
  existentes.push(user)
  await writeUsers(existentes)
}

async function searchByEmail(email) {
  const users = await readUsers()
  return users.find(u => u.email === email) || null
}

async function updateUser(email, updatedFields) {
  const users = await readUsers()
  const idx = users.findIndex(u => u.email === email)
  if (idx === -1) return null
  users[idx] = { ...users[idx], ...updatedFields }
  await writeUsers(users)
  return users[idx]
}

module.exports = { readUsers, writeUsers, addUser, searchByEmail, updateUser }
