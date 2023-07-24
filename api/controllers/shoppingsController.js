const shoppingsRepository = require('../models/repositories/shoppingsRepository')


const getShoppings = async (req, res) => {
    const loggedInUserId = req.user.id

    const searchQuery = req.query.search

    const foundShoppings = await shoppingsRepository.getShoppings(loggedInUserId, searchQuery)

    return res.status(200).send(foundShoppings)
}

const getShoppingById = async (req, res) => {
    const shoppingId = Number(req.params.id)

    const loggedInUserId = req.user.id

    if (shoppingId !== 0 && !shoppingId){
        return res.status(400).send({ message: 'Invalid shopping id' })
    }
    
    const foundShopping = await shoppingsRepository.getShoppingById(shoppingId, loggedInUserId)

    if (foundShopping != null){
        return res.status(200).send(foundShopping)
    }
    return res.status(404).send({ message: 'No shopping with this id was found for the logged in user' })
}

const createShopping = async (req, res) => {
    const { name, dueDateTime, description } = req.body

    const loggedInUserId = req.user.id

    if (!name){
        return res.status(400).send({ message: 'Shopping must have a name' })
    }

    let dateTimeConverted = null
    if (dueDateTime){
        dateTimeConverted = new Date(dueDateTime)
    }

    const newShoppingId = await shoppingsRepository.createShopping(name, dateTimeConverted, description, loggedInUserId)
    
    if (newShoppingId == null){
        return res.status(500).send({ message: 'Could not create new shopping' })
    }
    
    await shoppingsRepository.addUserToShopping(loggedInUserId, newShoppingId)
    const newShopping = await shoppingsRepository.getShoppingById(newShoppingId, loggedInUserId)

    if (newShopping == null){
        return res.status(500).send({ message: 'Could not create new shopping' })
    }

    res.status(201).send(newShopping)
}


module.exports = {
    getShoppings,
    getShoppingById,
    createShopping
}