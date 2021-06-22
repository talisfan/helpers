require('dotenv').config({ 
    path: process.env.NODE_ENV == 'dev' ? '.dev.env' :'.env' 
});

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_ACCESS_HOST,
    user: process.env.DB_ACCESS_USER,
    password: process.env.DB_ACCESS_PASS,
    database:process.env.DB_ACCESS_DATABASE,
    port: process.env.DB_ACCESS_PORT,
});

module.exports = pool;