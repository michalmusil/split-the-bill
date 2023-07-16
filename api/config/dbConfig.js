const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    db: 'Split_the_bill',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}