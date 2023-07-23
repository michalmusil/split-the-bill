const mysql = require('mysql2')
const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config()


const databasePool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise()


/*
// CREATE DATABASE
const createQuery = fs.readFileSync('./schema.sql')
await databasePool.query(createQuery)
*/

module.exports = databasePool
