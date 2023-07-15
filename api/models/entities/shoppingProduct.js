module.exports = (sequelize, Shopping, Product, DataTypes) => {
    const ShoppingProduct = sequelize.define(
        modelName = 'ShoppingProduct',
        attributes = {
            shoppingId: {
                type: DataTypes.INTEGER,
                references: {
                  model: Shopping,
                  key: 'id'
                }
            },
            productId: {
                type: DataTypes.INTEGER,
                references: {
                  model: Product,
                  key: 'id'
                }
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            unitPrice: {
                type: DataTypes.DOUBLE,
                allowNull: false
            }
        },
        options = {
            tableName: 'Shoppings_products',
            timeStamps: true // this will automatically manage created and updated columns
        }
    )

    return ShoppingProduct
}