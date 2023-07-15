module.exports = (sequelize, User, Shopping, Product, DataTypes) => {
    const Purchase = sequelize.define(
        modelName = 'Purchase',
        attributes = {
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                  model: User,
                  key: 'id'
                }
            },
            shoppingId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                  model: Shopping,
                  key: 'id'
                }
            },
            productId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                  model: Product,
                  key: 'id'
                }
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        options = {
            tableName: 'Purchases',
            timeStamps: true // this will automatically manage created and updated columns
        }
    )

    return Purchase
}