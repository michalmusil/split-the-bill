const productsRepository = require('../models/repositories/productsRepository')
const shopingsRepository = require('../models/repositories/shoppingsRepository')

const getProducts = async (req, res) => {
    const { shoppingId, name, creatorId } = req.query

    const loggedInUserId = req.user.id

    if (Number(shoppingId) || shoppingId === 0){
        // Gets the shopping only if the user is the owner, or is assigned to the shopping
        const shoppingAssignedToUser = await shopingsRepository.getShoppingOfUserById(shoppingId, loggedInUserId)
        if(shoppingAssignedToUser == null){
            return res.status(403).send({ message: 'You are not authorized for the specified shopping' })
        }
    }

    const found = await productsRepository.getProducts(name,shoppingId, creatorId)

    return res.status(200).send(found)
}

const getProductById = async (req, res) => {
    const productId = Number(req.params.id)
    
    if (!productId && productId !== 0){
        return res.status(400).send({ message: 'Invalid product id' })
    }

    const found = await productsRepository.getProductById(productId)

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

    const existingProduct = await productsRepository.getProductByName(name)
    
    if (existingProduct != null){
        return res.status(409).send({ message: "Product with this name already exists" })
    }

    const newProductId = await productsRepository.addProduct(name, null, description, loggedInUserId)

    const newProduct = await productsRepository.getProductById(newProductId)

    res.status(201).send({
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        imagePath: newProduct.imagePath,
        creatorId: newProduct.creatorId
    })
}


/*
const deleteProduct = async (req, res) => {
    const productId = Number(req.params.id)
    
    if (!productId && productId !== 0){
        return res.status(400).send({ message: 'Invalid product id' })
    }

    const found = await productsRepository.getProductById(productId)

    if (found == null){
        return res.status(404).send({ message: 'Product with this id was not found' })
    }

    const deleted = await productsRepository.deleteProduct(found.id)

    return res.status(200).send()
}
*/

module.exports = {
    getProducts,
    getProductById,
    addProduct
}