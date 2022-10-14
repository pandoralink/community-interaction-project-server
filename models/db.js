const mysql2 = require('mysql2')
const dbConfig = require('../config/db.config')

const Pool = mysql2
  .createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    port: dbConfig.port,
    database: dbConfig.database
  })

module.exports = { Pool }
