const { Pool } = require('pg')

const pool = new Pool({
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: 'database', // Service name of the database in `compose.dev.yaml`
  port: 5432, // Default PostgreSQL port
})

module.exports = { pool };