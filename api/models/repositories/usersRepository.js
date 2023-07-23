const database = require('../database')

const whereClauseBase = "WHERE 1=1" // The where clause base needs to be valid in case no other clauses are added, thus begins with 1=1

const getUsers = async (searchString, shoppingId, excludedUserId) => {
    let whereClause = whereClauseBase
    const values = []
    
    if (searchString){
        whereClause += ` AND (Users.username LIKE ? OR Users.email LIKE ?)`
        values.push(`%${searchString}%`, `%${searchString}%`)
    }
    if(Number(shoppingId) || shoppingId === 0){
        whereClause += ` AND Shoppings.id = ?`
        values.push(shoppingId)
    }
    if(Number(excludedUserId) || excludedUserId === 0){
        whereClause += ` AND Users.id != ?`
        values.push(excludedUserId)
    }


    
    const [foundUsers] = await database.query(`
        SELECT Users.id, Users.username, Users.email
        FROM Users 
        LEFT JOIN Users_shoppings ON Users.id = Users_shoppings.userId
        LEFT JOIN Shoppings ON Users_shoppings.shoppingId = Shoppings.id
        ${whereClause}
        GROUP BY Users.id
    `, values)

    return foundUsers
}



const getUserById = async (id) => {
    if (!Number(id) && id !== 0){
        return null
    }
    const [foundUser] = await database.query(`SELECT * FROM Users WHERE id = ?`,[id])
    return foundUser[0]
}



const getUserByEmail = async (email) => {
    if(!email){
        return null
    }
    const [foundUser] = await database.query(`SELECT * FROM Users WHERE email = ?`,[email])
    return foundUser[0]
}



const addUser = async (username, email, password) => {
    if (!username || !email || !password){
        return null
    }

    const now = new Date()
    const [result] = await database.query(
        `INSERT INTO Users(username, email, passwordHash, createdAt, updatedAt) VALUES(?, ?, ?, ?, ?)`,
        [username, email, password, now, now]
    )
    return result.insertId
}



const updateUser = async (userId, username, email, password) => {
    if(!Number(userId) && userId !== 0){
        return false
    }

    let setStatements = []
    let setValues = []

    if (username){
        setStatements.push("username = ?")
        setValues.push(username)
    }
    if(email){
        setStatements.push("email = ?")
        setValues.push(email)
    }
    if(password){
        setStatements.push("passwordHash = ?")
        setValues.push(password)
    }

    if (setStatements.length === 0){
        return false
    }


    const now = new Date()
    setStatements.push("updatedAt = ?")
    setValues.push(now)

    const finalSetStatement = setStatements.join(',')

    const [result] = await database.query(
        `UPDATE Users SET ${finalSetStatement} WHERE id = ?`,
        [...setValues, userId]
    )
    return result.affectedRows > 0
}

const deleteUser = async (id) => {
    if (!Number(id) && id !== 0){
        return false
    }
    const [result] = await database.query(`DELETE FROM Users WHERE id = ?`,[id])
    return result.affectedRows > 0
}


module.exports = {
    getUsers,
    getUserById,
    getUserByEmail,
    addUser,
    updateUser,
    deleteUser
}