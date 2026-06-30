const fs = require('fs')
const path = require('path')
require('dotenv').config()
const { pool } = require('../config/database')

async function migrate() {
  const client = await pool.connect()

  try {
    const migrationsDir = path.join(__dirname, 'migrations')
    const files = fs.readdirSync(migrationsDir).sort()

    for (const file of files) {
      if (!file.endsWith('.sql')) continue

      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
      console.log(`Running migration: ${file}`)
      await client.query(sql)
      console.log(`  ✓ Done`)
    }

    const seedsDir = path.join(__dirname, 'seeds')
    if (fs.existsSync(seedsDir)) {
      const seedFiles = fs.readdirSync(seedsDir).sort()
      for (const file of seedFiles) {
        if (!file.endsWith('.sql')) continue

        const sql = fs.readFileSync(path.join(seedsDir, file), 'utf8')
        console.log(`Running seed: ${file}`)
        await client.query(sql)
        console.log(`Done`)
      }
    }

    console.log('\nMigration complete.')
  } catch (err) {
    console.error('Migration failed:', err.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

migrate()
