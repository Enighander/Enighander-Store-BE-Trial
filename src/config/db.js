const {Pool} = require('pg')
const pool = new Pool({
    host: process.env.localhost,
    user: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD
})

module.exports = pool