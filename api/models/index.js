const dbConfig = require('../config/dbConfig')

const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(
     database = dbConfig.db,
     username = dbConfig.user,
     password = dbConfig.password,
     options = {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        operatorAliases: false,
        pool: dbConfig.pool
     }
)

sequelize.authenticate().then(() => {
    console.log('Database connected')
}).catch(err => {
    console.log(`Database authentication error: ${err}`)
})

const db = {
    Sequelize: Sequelize,
    sequelize: sequelize
}

db.users = require('./entities/user')(sequelize, DataTypes)
db.shoppings = require('./entities/shopping')(sequelize, DataTypes)
db.products = require('./entities/product')(sequelize, DataTypes)

db.sequelize.sync(options = { force: false }).then(() => {
    console.log('Database synced')
})

module.exports = db
