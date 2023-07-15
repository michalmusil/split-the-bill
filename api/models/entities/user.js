module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        modelName = 'User',
        attributes = {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(500),
                allowNull: false,
                unique: true
            },
            passwordHash: {
                type: DataTypes.STRING(1000),
                allowNull: false
            }
        },
        options = {
            tableName: 'Users',
            timeStamps: true // this will automatically manage created and updated columns
        }
    )

    return User
}