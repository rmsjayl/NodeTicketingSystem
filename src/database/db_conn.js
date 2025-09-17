const { Sequelize } = require('sequelize')

const sequelize  = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER,process.env.POSTGRES_PASSWORD, {
  host: 'database', // Service name of the database in `compose.dev.yaml`
  dialect: process.env.DB_DIALECT
})

module.exports = { sequelize };