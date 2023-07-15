module.exports = (sequelize, User, Shopping, DataTypes) => {
    const UserShopping = sequelize.define(
        modelName = 'UserShopping',
        attributes = {
            userId: {
                type: DataTypes.INTEGER,
                references: {
                  model: User,
                  key: 'id'
                }
            },
            shoppingId: {
                type: DataTypes.INTEGER,
                references: {
                  model: Shopping,
                  key: 'id'
                }
            }
        },
        options = {
            tableName: 'Users_shoppings',
            timeStamps: true // this will automatically manage created and updated columns
        }
    )

    return UserShopping
}