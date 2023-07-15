module.exports = (sequelize, User, DataTypes) => {
    const Product = sequelize.define(
        modelName = 'Product',
        attributes = {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(500),
                allowNull: false,
                unique: true
            },
            imagePath: {
                type: DataTypes.STRING(1000),
            },
            description: {
                type: DataTypes.TEXT,
            }
        },
        options = {
            tableName: 'Products',
            timeStamps: true // this will automatically manage created and updated columns
        }
    )

    return Product
}