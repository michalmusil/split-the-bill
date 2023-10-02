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
    values.push(shoppingId) // need it 2 times in the query

    if (Number(userId) || userId === 0){
        whereClause += ` AND Purchases.userId = ?`
        values.push(userId)
    }

    
    const [foundPurchases] = await database.query(`
        WITH product_assignments AS (
            SELECT productId, quantity, unitPrice, (quantity * unitPrice) AS totalPrice
            FROM Shoppings_products
            WHERE shoppingId = ?
        )
        SELECT Purchases.productId, Products.name, Products.description, CAST(SUM(Purchases.quantity) AS UNSIGNED) AS quantityPurchased, product_assignments.quantity AS quantityToBePurchased,
        product_assignments.unitPrice AS unitPrice, (SUM(Purchases.quantity) * product_assignments.unitPrice) AS ammountPurchased, product_assignments.totalPrice AS ammountToBePurchased,
        JSON_ARRAYAGG(JSON_OBJECT('id', Users.id, 'username', Users.username, 'email', Users.email, 'purchased', Purchases.quantity)) AS users
        FROM Purchases 
        LEFT JOIN Products ON Purchases.productId = Products.id
        LEFT JOIN Users ON Purchases.UserId = Users.id
        LEFT JOIN product_assignments ON Purchases.productId = product_assignments.productId
        ${whereClause}
        GROUP BY Purchases.productId
    `, values)

    return foundPurchases
}

const getPurchasesByUsers = async (shoppingId, userId) => {
    if (!Number(shoppingId) && shoppingId !== 0){
        return []
    }
    
    let whereClause = whereClauseBase
    const values = []
    
    whereClause += ` AND Purchases.shoppingId = ?`
    values.push(shoppingId)
    values.push(shoppingId) // need it 2 times in the query

    if (Number(userId) || userId === 0){
        whereClause += ` AND Purchases.userId = ?`
        values.push(userId)
    }

    
    const [foundPurchases] = await database.query(`
        WITH product_assignments AS (
            SELECT productId, quantity, unitPrice, (quantity * unitPrice) AS totalPrice
            FROM Shoppings_products
            WHERE shoppingId = ?
        )
        SELECT Purchases.userId, Users.username, Users.email, CAST(SUM(Purchases.quantity) AS UNSIGNED) AS totalQuantityPurchased, SUM(Purchases.quantity * product_assignments.unitPrice) AS totalAmmountPurchased,
        JSON_ARRAYAGG(JSON_OBJECT(
            'id', Products.id, 
            'name', Products.name, 
            'description', Products.description, 
            'quantityToBePurchased', product_assignments.quantity,
            'unitPrice', product_assignments.unitPrice,
            'quantityPurchased', Purchases.quantity,
            'ammountPurchased', (Purchases.quantity * product_assignments.unitPrice)
        )) AS purchasedProducts
        FROM Purchases 
        LEFT JOIN Users ON Purchases.userId = Users.id
        LEFT JOIN Products ON Purchases.productId = Products.id
        LEFT JOIN product_assignments ON Purchases.productId = product_assignments.productId
        ${whereClause}
        GROUP BY Purchases.userId
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
    WITH total_purchased AS (SELECT Purchases.productId AS productId, SUM(Purchases.quantity) AS quantity FROM Purchases WHERE Purchases.shoppingId = ? AND Purchases.productId = ?)
    SELECT COALESCE((Shoppings_products.quantity - total_purchased.quantity), Shoppings_products.quantity) AS remaining
    FROM Shoppings_products
    LEFT JOIN total_purchased ON Shoppings_products.productId = total_purchased.productId
    WHERE Shoppings_products.shoppingId = ? AND Shoppings_products.productId = ?
    `, [shoppingId, productId, shoppingId, productId])

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

const deleteAllPurchasesOfUser = async (shoppingId, userId) => {
    if((!Number(shoppingId) && shoppingId !== 0) || (!Number(userId) && userId !== 0)){
        return false
    }

    const [result] = await database.query(`
    DELETE FROM Purchases 
    WHERE shoppingId = ? AND userId = ?
    `,
    [shoppingId, userId]
    )
    return result.affectedRows > 0
}

const deleteAllPurchasesOfProduct = async (shoppingId, productId) => {
    if((!Number(shoppingId) && shoppingId !== 0) || (!Number(productId) && productId !== 0)){
        return false
    }

    const [result] = await database.query(`
    DELETE FROM Purchases 
    WHERE shoppingId = ? AND productId = ?
    `,
    [shoppingId, productId]
    )
    return result.affectedRows > 0
}




module.exports = {
    getPurchasesByProducts,
    getPurchasesByUsers,
    getPurchaseByIds,
    getProductRemainingPurchases,
    addNewPurchase,
    updateExistingPurchase,
    deletePurchase,
    deleteAllPurchasesOfUser,
    deleteAllPurchasesOfProduct,
}