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



// DEFINING ENTITIES (TABLES)
db.users = require('./entities/user')(sequelize, DataTypes)
db.shoppings = require('./entities/shopping')(sequelize, db.users, DataTypes)
db.products = require('./entities/product')(sequelize, db.users, DataTypes)
db.userShoppings = require('./entities/userShopping')(sequelize, db.users, db.shoppings, DataTypes)
db.shoppingProducts = require('./entities/shoppingProduct')(sequelize, db.shoppings, db.products, DataTypes)
db.purchases = require('./entities/purchase')(sequelize, db.users, db.shoppings, db.products, DataTypes)



// DEFINING RELATIONSHIPS
// 1 user : N shoppings - user is the creator of the shopping
db.users.hasMany(db.shoppings, { foreignKey: { allowNull: false } })
db.shoppings.belongsTo(db.users) 

// 1 user : N products - user is the creator of the product
db.users.hasMany(db.products, { foreignKey: {  allowNull: false } })
db.products.belongsTo(db.users) 

// N users : M shoppings - all the users participating in the shopping
db.users.belongsToMany(db.shoppings, { through: db.userShoppings, foreignKey: 'userId' })
db.shoppings.belongsToMany(db.users, { through: db.userShoppings, foreignKey: 'shoppingId' })

// N shoppings : M products - all the products that are part of a shoppin with quantity and unit price
db.shoppings.belongsToMany(db.products, { through: db.shoppingProducts, foreignKey: 'shoppingId' })
db.products.belongsToMany(db.shoppings, { through: db.shoppingProducts, foreignKey: 'productId' })

// N users : M shoppings and products - manages user purchases of pruducts of a shopping
db.users.belongsToMany(db.shoppings, { through: db.purchases, foreignKey: 'userId' })
db.shoppings.belongsToMany(db.users, { through: db.purchases, foreignKey: 'shoppingId' })

db.users.belongsToMany(db.products, { through: db.purchases, foreignKey: 'userId' })
db.products.belongsToMany(db.users, { through: db.purchases, foreignKey: 'productId' })




// SYNCING THE DATABASE (USE MIGRATIONS IN PRODUCTION !!!)
db.sequelize.sync(options = { force: false }).then(() => {
    console.log('Database synced')
})

module.exports = db
