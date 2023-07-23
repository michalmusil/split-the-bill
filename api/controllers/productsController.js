const database = require('../models/database')
const { Op } = require('sequelize')
const product = require('../models/entities/product')

const products = database.products
const shoppings = database.shoppings
const shoppingProducts = database.shoppingProducts

const getProducts = async (req, res) => {
    let where = {}
    let include = []

    const shoppingId = req.query.shoppingId
    const name = req.query.name

    if (shoppingId != null && Number(shoppingId)){
        include.push({
            model: shoppings,
            where: {
                id: shoppingId
            }
        })
    }

    if (name != null){
        where.name = {
            [Op.substring]: name
        }
    }

    const found = await products.findAll({
        where: where,
        include: include,
        attributes: ['id', 'name', 'imagePath', 'description']
    })

    return res.status(200).send(found)
}

const getProductById = async (req, res) => {
    const productId = Number(req.params.id)
    
    if (!productId && productId !== 0){
        return res.status(400).send({ message: 'Invalid product id' })
    }

    const found = await products.findOne({
        where: {
            id: productId
        },
        attributes: ['id', 'name', 'imagePath', 'description']
    })

    if (found == null){
        return res.status(404).send({ message: 'Product with this id was not found' })
    }

    return res.status(200).send(found)
}


const addProduct = async (req, res) => {
    const { name, description } = req.body

    const loggedInUserId = req.user.id

    if (name == null){
        return res.status(400).send({ message: 'Product must have a name' })
    }

    const existingProduct = await products.findOne({
        where: {
            name: name
        }
    })

    if (existingProduct != null){
        return res.status(409).send({ message: "Product with this name already exists" })
    }

    const newProduct = await products.create({
        name: name,
        description: description,
        UserId: loggedInUserId
    })

    res.status(201).send({
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        imagePath: newProduct.imagePath
    })
}

const deleteProduct = async (req, res) => {
    const productId = Number(req.params.id)
    
    if (!productId && productId !== 0){
        return res.status(400).send('Invalid product id')
    }

    const found = await products.findOne({
        where: {
            id: productId
        }
    })

    if (found == null){
        return res.status(404).send({ message: 'Product with this id was not found' })
    }

    found.destroy()

    return res.status(200).send()
}

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    deleteProduct
}