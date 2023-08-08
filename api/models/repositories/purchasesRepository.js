const database = require('../database')

const whereClauseBase = "WHERE 1=1" // The where clause base needs to be valid in case no other clauses are added, thus begins with 1=1

const getPurchasesByProducts = async (shoppingId, userId) => {
    if (!Number(shoppingId) && shoppingId !== 0){
        return []
    }
    
    let whereClause = whereClauseBase
    const values = []
    
    whereClause += ` AND Purchases.shoppingId = ?`
    values.push(shoppingId)

    if (Number(userId) || userId === 0){
        whereClause += ` AND Purchases.userId = ?`
        values.push(userId)
    }

    
    const [foundPurchases] = await database.query(`
        SELECT Purchases.productId, Products.name, Products.description, SUM(Purchases.quantity) AS totalPurchased, 
        JSON_ARRAYAGG(JSON_OBJECTAGG(Users.id, Users.username, Users.email, Purchases.quantity AS quantityPurchased)) AS users
        FROM Purchases 
        LEFT JOIN Products ON Shoppings_products.productId = Products.id
        LEFT JOIN Users ON Purchases.UserId = Users.id
        ${whereClause}
        GROUP BY Purchases.productId
    `, values)

    return foundPurchases
}

const getPurchaseByIds = async (shoppingId, productId, userId) => {
    if((!Number(shoppingId) && shoppingId !== 0) || (!Number(productId) && productId !== 0) || (!Number(userId) && userId !== 0)){
        return null
    }

    const [result] = await database.query(`
    SELECT Purchases.shoppingId, Purchases.productId, Purchases.userId, Purchases.quantity
    FROM Purchases
    WHERE Purchases.shoppingId = ? AND Purchases.productId = ? AND Purchases.userId = ?
    `, [shoppingId, productId, userId])

    return result[0]
}

const getProductRemainingPurchases = async (productId, shoppingId) => {
    if((!Number(shoppingId) && shoppingId !== 0) || (!Number(productId) && productId !== 0)){
        return null
    }

    const [result] = await database.query(`
    SELECT COALESCE((MAX(Shoppings_products.quantity) - SUM(Purchases.quantity)), MAX(Shoppings_products.quantity)) AS remaining
    FROM Purchases
    RIGHT JOIN Shoppings_products ON Purchases.productId = Shoppings_products.productId
    WHERE (Purchases.shoppingId = ? OR Shoppings_products.shoppingId = ?) AND (Purchases.productId = ? OR Shoppings_products.productId = ?)
    `, [shoppingId, shoppingId, productId, productId])

    const adjusted = result[0]
    return { remaining: Number(adjusted?.remaining) }
} 

const addNewPurchase = async (shoppingId, productId, userId, quantity) => {
    if((!Number(shoppingId) && shoppingId !== 0) || (!Number(productId) && productId !== 0) ||
        (!Number(userId) && userId !== 0) || (!Number(quantity) && quantity !== 0)){
            return null
    }

    const now = new Date()
    const [result] = await database.query(
        `INSERT INTO Purchases(shoppingId, productId, userId, quantity, createdAt, updatedAt) VALUES(?, ?, ?, ?, ?, ?)`,
        [shoppingId, productId, userId, quantity, now, now]
    )
    return result.insertId
}

const updateExistingPurchase = async (shoppingId, productId, userId, quantity) => {
    if((!Number(shoppingId) && shoppingId !== 0) || (!Number(productId) && productId !== 0) ||
        (!Number(userId) && userId !== 0) || (!Number(quantity) && quantity !== 0)){
            return false
    }

    const now = new Date()
    const [result] = await database.query(
        `UPDATE Purchases SET quantity = ?, updatedAt = ? WHERE shoppingId = ? AND productId = ? AND userId = ?`,
        [quantity, now, shoppingId, productId, userId]
    )
    return result.affectedRows > 0
}

const deletePurchase = async (shoppingId, productId, userId) => {
    if((!Number(shoppingId) && shoppingId !== 0) || (!Number(productId) && productId !== 0) || (!Number(userId) && userId !== 0)){
        return false
    }

    const [result] = await database.query(`
    DELETE FROM Purchases 
    WHERE shoppingId = ? AND productId = ? AND userId = ?
    `,
    [shoppingId, productId, userId]
    )
    return result.affectedRows > 0
}





module.exports = {
    getPurchasesByProducts,
    getPurchaseByIds,
    getProductRemainingPurchases,
    addNewPurchase,
    updateExistingPurchase,
    deletePurchase
}