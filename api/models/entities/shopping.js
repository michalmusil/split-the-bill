module.exports = (sequelize, User, DataTypes) => {
    const Shopping = sequelize.define(
        modelName = 'Shopping',
        attributes = {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(500),
                allowNull: false
            },
            dueDateTime: {
                type: DataTypes.DATE,
            },
            description: {
                type: DataTypes.TEXT,
            }
        },
        options = {
            tableName: 'Shoppings',
            timeStamps: true // this will automatically manage created and updated columns
        }
    )

    return Shopping
}