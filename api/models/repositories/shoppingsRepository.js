const database = require('../database')

const whereClauseBase = "WHERE 1=1" // The where clause base needs to be valid in case no other clauses are added, thus begins with 1=1

const getShoppingsOfUser = async (userId, searchQuery) => {
    let whereClause = whereClauseBase
    const values = []

    if(!Number(userId) && Number(userId) !== 0){
        return []
    }
    
    if (searchQuery){
        whereClause += ` AND (Shoppings.name LIKE ? OR Shoppings.description LIKE ?)`
        values.push(`%${searchQuery}%`, `%${searchQuery}%`)
    }
    
    whereClause += ` AND (Shoppings.creatorId = ? OR (Users.id = ? AND Users.isDeleted = ?))`
    values.push(userId, userId, false)

    
    const [foundShoppings] = await database.query(`
        SELECT Shoppings.id, Shoppings.name, Shoppings.dueDateTime, Shoppings.description, Shoppings.creatorId, 
            SUM(Shoppings_products.quantity) AS numberOfItems, SUM(Shoppings_products.quantity * Shoppings_products.unitPrice) AS totalCost,
            (COUNT(DISTINCT(Users.id))) AS numberOfParticipants
        FROM Shoppings 
        LEFT JOIN Users_shoppings ON Shoppings.id = Users_shoppings.shoppingId
        LEFT JOIN Users ON Users_shoppings.userId = Users.id
        LEFT JOIN Shoppings_products ON Shoppings.id = Shoppings_products.shoppingId
        ${whereClause}
        GROUP BY Shoppings.id
        ORDER BY Shoppings.dueDateTime DESC
    `, values)

    return foundShoppings
}


// This function also authorizes the user, because it only returns shopping if user is the owner or is assigned to it
const getShoppingOfUserById = async (id, userId) => {
    if ((!Number(id) && id !== 0) || (!Number(userId) && userId !== 0)){
        return null
    }
    const [foundShopping] = await database.query(`
    SELECT Shoppings.id, Shoppings.name, Shoppings.dueDateTime, Shoppings.description, Shoppings.creatorId,
        SUM(Shoppings_products.quantity) AS numberOfItems, SUM(Shoppings_products.quantity * Shoppings_products.unitPrice) AS totalCost,
        (COUNT(DISTINCT(Users.id))) AS numberOfParticipants
    FROM Shoppings
    LEFT JOIN Users_shoppings ON Shoppings.id = Users_shoppings.shoppingId
    LEFT JOIN Users ON Users_shoppings.userId = Users.id
    LEFT JOIN Shoppings_products ON Shoppings.id = Shoppings_products.shoppingId
    WHERE Shoppings.id = ? AND (Shoppings.creatorId = ? OR (Users.id = ? AND Users.isDeleted = ?))
    GROUP BY Shoppings.id
    `
    ,[id, userId, userId, false])
    return foundShopping[0]
}



const createShopping = async (name, dueDateTime, description, creatorId) => {
    if (!name || (!Number(creatorId) && creatorId !== 0)){
        return null
    }

    const now = new Date()
    const [result] = await database.query(
        `INSERT INTO Shoppings(name, dueDateTime, description, creatorId, createdAt, updatedAt) VALUES(?, ?, ?, ?, ?, ?)`,
        [name, dueDateTime || null, description || null, creatorId, now, now]
    )
    return result.insertId
}



const addUserToShopping = async (userId, shoppingId) => {
    if ((!Number(userId) && userId !== 0) || (!Number(shoppingId) && shoppingId !== 0)){
        return null
    }

    const now = new Date()
    try{
        const [result] = await database.query(
            `INSERT INTO Users_shoppings(userId, shoppingId, createdAt, updatedAt) VALUES(?, ?, ?, ?)`,
            [userId, shoppingId, now, now]
        )
        return result.insertId
    }catch(error){
        return null
    }
}



const removeUserFromShopping = async (userId, shoppingId) => {
    if ((!Number(userId) && userId !== 0) || (!Number(shoppingId) && shoppingId !== 0)){
        return false
    }
    try{
        const [result] = await database.query(
            `DELETE FROM Users_shoppings WHERE userId = ? AND shoppingId = ?`,
            [userId, shoppingId]
        )
        return result.affectedRows > 0
    }catch(error){
        return false
    }
}



const updateShopping = async (shoppingId, name, dueDateTime, description) => {
    if(!Number(shoppingId) && shoppingId !== 0){
        return false
    }

    let setStatements = []
    let setValues = []

    if (name){
        setStatements.push("name = ?")
        setValues.push(name)
    }
    if(dueDateTime instanceof Date){
        setStatements.push("dueDateTime = ?")
        setValues.push(dueDateTime)
    }
    if(typeof description !== 'undefined'){
        setStatements.push("description = ?")
        setValues.push(description)
    }

    if (setStatements.length === 0){
        return false
    }


    const now = new Date()
    setStatements.push("updatedAt = ?")
    setValues.push(now)

    const finalSetStatement = setStatements.join(',')

    const [result] = await database.query(
        `UPDATE Shoppings SET ${finalSetStatement} WHERE id = ?`,
        [...setValues, shoppingId]
    )
    return result.affectedRows > 0
}



const deleteShopping = async (id) => {
    if (!Number(id) && id !== 0){
        return false
    }
    const [result] = await database.query(`DELETE FROM Shoppings WHERE id = ?`,[id])
    return result.affectedRows > 0
}










const getProductAssignmentsOfShopping = async (shoppingId) => {
    if (!Number.isInteger(Number(shoppingId))){
        return null
    }
    const [foundProductAssignments] = await database.query(`
    SELECT Products.id, Products.name, Products.description, Shoppings_products.quantity, Shoppings_products.unitPrice
    FROM Products
    INNER JOIN Shoppings_products ON Products.id = Shoppings_products.productId
    WHERE Shoppings_products.shoppingId = ?
    GROUP BY Products.id
    `
    ,[shoppingId])
    return foundProductAssignments
}


const getProductToShopping = async(shoppingId, productId) => {
    if ((!Number(shoppingId) && shoppingId !== 0) || (!Number(productId) && productId !== 0)){
        return null
    }

    const [found] = await database.query(`
    SELECT shoppingId, productId, quantity, unitPrice
    FROM Shoppings_products
    WHERE shoppingId = ? AND productId = ?
    `
    ,[shoppingId, productId])

    return found[0]
}



const addProductToShopping = async (shoppingId, productId, quantity, unitPrice) => {
    if ((!Number(shoppingId) && shoppingId !== 0) || (!Number(productId) && productId !== 0) ||
        !Number.isInteger(Number(quantity))){
        return null
    }
    if(!Number(unitPrice) && unitPrice !== 0){
        unitPrice = null
    }

    const now = new Date()
    try{
        const [result] = await database.query(`
        INSERT INTO 
        Shoppings_products(shoppingId, productId, quantity, unitPrice, createdAt, updatedAt) 
        VALUES(?, ?, ?, ?, ?, ?)
        `,
            [shoppingId, productId, quantity, unitPrice, now, now]
        )
        return result.insertId
    }catch(error){
        return null
    }
}

const updateProductToShopping = async (shoppingId, productId, quantity, unitPrice) => {
    if ((!Number(shoppingId) && shoppingId !== 0) || (!Number(productId) && productId !== 0)){
        return false
    }

    let setStatements = []
    let setValues = []

    if(Number.isInteger(Number(quantity))){
        setStatements.push('quantity = ?')
        setValues.push(quantity)
    }

    // Unit price can't be undefined
    if(Number(unitPrice) || unitPrice === 0 || unitPrice === null){
        setStatements.push('unitPrice = ?')
        setValues.push(unitPrice)
    }

    if(setStatements.length <= 0){
        return false
    }

    const now = new Date()
    setStatements.push("updatedAt = ?")
    setValues.push(now)

    const finalSetStatement = setStatements.join(',')

    const [result] = await database.query(`
    UPDATE Shoppings_products 
    SET ${finalSetStatement}
    WHERE shoppingId = ? AND productId = ?
    `,
    [...setValues, shoppingId, productId]
    )
    return result.affectedRows > 0
}


const deleteProductToShopping = async (shoppingId, productId) => {
    if ((!Number(shoppingId) && shoppingId !== 0) || (!Number(productId) && productId !== 0)){
        return false
    }

    const [result] = await database.query(`
    DELETE FROM Shoppings_products 
    WHERE shoppingId = ? AND productId = ?
    `,
    [shoppingId, productId]
    )
    return result.affectedRows > 0
}


module.exports = {
    getShoppingsOfUser,
    getShoppingOfUserById,
    createShopping,
    addUserToShopping,
    removeUserFromShopping,
    updateShopping,
    deleteShopping,
    getProductAssignmentsOfShopping,
    getProductToShopping,
    addProductToShopping,
    updateProductToShopping,
    deleteProductToShopping
}