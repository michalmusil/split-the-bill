const database = require('../models/database')

const whereClauseBase = "WHERE 1=1" // The where clause base needs to be valid in case no other clauses are added, thus begins with 1=1

const getProducts = async (name, shoppingId, creatorId) => {
    let whereClause = whereClauseBase
    const values = []
    
    if (name){
        whereClause += ` AND (Products.name LIKE ?)`
        values.push(`%${name}%`)
    }
    if(Number(shoppingId) || shoppingId === 0){
        whereClause += ` AND Shoppings.id = ?`
        values.push(shoppingId)
    }
    if(Number(creatorId) || creatorId === 0){
        whereClause += ` AND Products.creatorId = ?`
        values.push(creatorId)
    }


    
    const [foundProducts] = await database.query(`
        SELECT Products.id, Products.name, Products.imagePath, Products.description, Products.creatorId
        FROM Products 
        LEFT JOIN Shoppings_products ON Products.id = Shoppings_products.productId
        LEFT JOIN Shoppings ON Shoppings_products.shoppingId = Shoppings.id
        ${whereClause}
        GROUP BY Products.id
    `, values)

    return foundProducts
}



const getProductById = async (id) => {
    if (!Number(id) && id !== 0){
        return null
    }
    const [foundProduct] = await database.query(`
    SELECT id, name, imagePath, description, creatorId 
    FROM Products 
    WHERE id = ?
    `,
    [id])
    return foundProduct[0]
}




const getProductByName = async (name) => {
    if (!name){
        return null
    }

    const [foundProduct] = await database.query(`
    SELECT id, name, imagePath, description, creatorId 
    FROM Products 
    WHERE name = ?
    `
    ,[name])
    return foundProduct[0]
}



const addProduct = async (name, imagePath, description, creatorId) => {
    if (!name || (!Number(creatorId) && creatorId !== 0)){
        return null
    }

    const now = new Date()
    const [result] = await database.query(
        `INSERT INTO Products(name, imagePath, description, creatorId, createdAt, updatedAt) VALUES(?, ?, ?, ?, ?, ?)`,
        [name, imagePath || null, description || null, creatorId, now, now]
    )
    return result.insertId
}



const updateProduct = async (productId, name, imagePath, description) => {
    if(!Number(productId) && productId !== 0){
        return false
    }

    let setStatements = []
    let setValues = []

    if (name){
        setStatements.push("name = ?")
        setValues.push(name)
    }
    if(imagePath){
        setStatements.push("imagePath = ?")
        setValues.push(imagePath)
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
        `UPDATE Products SET ${finalSetStatement} WHERE id = ?`,
        [...setValues, productId]
    )
    return result.affectedRows > 0
}

const deleteProduct = async (id) => {
    if (!Number(id) && id !== 0){
        return false
    }
    const [result] = await database.query(`DELETE FROM Products WHERE id = ?`,[id])
    return result.affectedRows > 0
}


module.exports = {
    getProducts,
    getProductById,
    getProductByName,
    addProduct,
    updateProduct,
    deleteProduct
}