const shoppingsRepository = require('../models/repositories/shoppingsRepository')
const usersRepository = require('../models/repositories/usersRepository')
const productsRepository = require('../models/repositories/productsRepository')


const getShoppings = async (req, res) => {
    const loggedInUserId = req.user.id

    const searchQuery = req.query.search

    const foundShoppings = await shoppingsRepository.getShoppingsOfUser(loggedInUserId, searchQuery)

    return res.status(200).send(foundShoppings)
}



const getShoppingById = async (req, res) => {
    const shoppingId = Number(req.params.id)

    const loggedInUserId = req.user.id

    if (shoppingId !== 0 && !shoppingId){
        return res.status(400).send({ message: 'Invalid shopping id' })
    }
    
    const foundShopping = await shoppingsRepository.getShoppingOfUserById(shoppingId, loggedInUserId)

    if (foundShopping != null){
        return res.status(200).send(foundShopping)
    }
    return res.status(400).send({ message: 'No shopping with this id was found for the logged in user' })
}






const getProductAssignmentsOfShopping = async (req, res) => {
    const shoppingId = req.params.id
    const loggedInUserId = req.user.id

    const shopping = await shoppingsRepository.getShoppingOfUserById(shoppingId, loggedInUserId)

    if(shopping == null){
        return res.status(400).send({ message: 'User can get product assignments of shoppings which he/she created or is assigned to' })
    }

    const foundProductAsignments = await shoppingsRepository.getProductAssignmentsOfShopping(shoppingId)

    return res.status(200).send(foundProductAsignments)
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
    const newShopping = await shoppingsRepository.getShoppingOfUserById(newShoppingId, loggedInUserId)

    if (newShopping == null){
        return res.status(500).send({ message: 'Could not create new shopping' })
    }

    res.status(201).send(newShopping)
}





const updateShopping = async (req, res) => {
    const { shoppingId, name, dueDateTime, description } = req.body

    const loggedInUserId = req.user.id

    if (!Number(shoppingId) && shoppingId !== 0){
        return res.status(400).send({ message: 'shoppingId must be specified in the body to update it' })
    }

    let dateTimeConverted = null
    if (dueDateTime){
        dateTimeConverted = new Date(dueDateTime)
    }

    const shoppingToUpdate = await shoppingsRepository.getShoppingOfUserById(shoppingId, loggedInUserId)

    if (shoppingToUpdate == null){
        return res.status(400).send({ message: 'User can only update shoppings which he/she created' })
    }

    if (shoppingToUpdate.creatorId !== loggedInUserId){
        return res.status(400).send({ message: 'User can only update shoppings which he/she created' })
    }

    const updated = await shoppingsRepository.updateShopping(shoppingId, name, dateTimeConverted, description)

    if (!updated){
        return res.status(500).send({ message: 'Could not update the shopping' })
    }

    return res.status(200).send()
}





const deleteShopping = async (req, res) => {
    const shoppingId = req.params.id
    const loggedInUserId = req.user.id

    const shopping = await shoppingsRepository.getShoppingOfUserById(shoppingId, loggedInUserId)

    if(shopping == null){
        return res.status(400).send({ message: 'User can only delete shoppings which he/she created' })
    }

    if(shopping.creatorId !== loggedInUserId){
        return res.status(400).send({ message: 'User can only delete shoppings which he/she created' })
    }

    const deleted = await shoppingsRepository.deleteShopping(shoppingId)
    if(!deleted){
        return res.status(500).send({ message: 'Failed to detele shopping' })
    }
    
    return res.status(200).send()
}





const assignUserToShopping = async(req, res) => {
    const shoppingId = Number(req.params.id)
    const userToAssignId = Number(req.query.userId)
    const loggedInUserId = req.user.id

    // User id was not correcly specified
    if ((!userToAssignId && userToAssignId !== 0)){
        return res.status(400).send({ message: 'Query of userId must be set to specify which user to assign to the shopping' }) 
    }

    const shoppingToAssignTo = await shoppingsRepository.getShoppingOfUserById(shoppingId, loggedInUserId)

    if (shoppingToAssignTo == null){
        return res.status(400).send({ message: 'User can only assign to shoppings which he/she is already assigned in, or which he/she created' })
    }

    const userToAssign = await usersRepository.getUserById(userToAssignId)

    if (userToAssign == null){
        return res.status(404).send({ message: 'No user with this id was found' })
    }

    const createdAssignmentId = await shoppingsRepository.addUserToShopping(userToAssignId, shoppingId)

    if (createdAssignmentId == null){
        return res.status(500).send({ message: 'Could not assign user to shopping' })
    }

    return res.status(201).send({ message: `User with id: ${userToAssignId} was assigned to shopping with id: ${shoppingId}` })
}





const unassignUserFromShopping = async(req, res) => {
    const shoppingId = Number(req.params.id)
    const userToUnassignId = Number(req.query.userId)
    const loggedInUserId = req.user.id

    // User id was not correcly specified
    if ((!userToUnassignId && userToUnassignId !== 0)){
        return res.status(400).send({ message: 'Query of userId must be set to specify which user to unassign from the shopping' }) 
    }

    // Check if the logged in user is even autorized for this operation
    const shoppingToUnassignFrom = await shoppingsRepository.getShoppingOfUserById(shoppingId, loggedInUserId)
    if (shoppingToUnassignFrom == null){
        return res.status(400).send({ message: 'User can only unassign from shoppings which he/she is already assigned in, or which he/she created' })
    }

    // Then check, if the user doing the unassignment is the creator of the shopping, or is unassigning him/herself (in other cases, user is not authorized)
    const userIsAuthorized = (shoppingToUnassignFrom.creatorId !== userToUnassignId) && 
        ((shoppingToUnassignFrom.creatorId === loggedInUserId) || (userToUnassignId === loggedInUserId))
    if(!userIsAuthorized){
        return res.status(403).send({ message: 'Creator can only unassign assigned users. Assigned user can only unassign him/herself' })
    }

    const userToUnassign = await usersRepository.getUserById(userToUnassignId)

    if (userToUnassign == null){
        return res.status(404).send({ message: 'No user with this id was found' })
    }

    const userAssignmentDeleted = await shoppingsRepository.removeUserFromShopping(userToUnassignId, shoppingId)

    if (!userAssignmentDeleted){
        return res.status(500).send({ message: 'Could not unassign user from shopping' })
    }

    return res.status(200).send()
}





const addOrUpdateProduct = async(req, res) => {
    const shoppingId = Number(req.params.id)
    
    const { productName, quantity, unitPrice } = req.body

    const loggedInUserId = req.user.id

    const shoppingOfUser = await shoppingsRepository.getShoppingOfUserById(shoppingId, loggedInUserId)

    if(shoppingOfUser == null){
        return res.status(403).send({ message: 'User can only update products of shoppings, which he/she created or is assigned to' })
    }

    if (!productName){
        return res.status(400).send({ message: 'Product name must be specified' })
    }

    if (!Number.isInteger(Number(quantity))){
        return res.status(400).send({ message: 'Quantity must be specified and must be an integer' })
    }

    const product = await productsRepository.getProductByName(productName)


    let productId = null
    // If product does not yet exist, create one
    if(product == null){
        productId = await productsRepository.addProduct(productName, null, null, loggedInUserId)
        const newAssignmentId = await shoppingsRepository.addProductToShopping(shoppingId, productId, quantity, unitPrice)
        return res.status(201).send({ productId: productId ,message: 'New product created and added to shopping' })
    }

    productId = product.id

    // Check if this product is already assigned to this shopping
    const productAssignment = await shoppingsRepository.getProductToShopping(shoppingId, productId)
    // If yes, just update it
    if(productAssignment != null){
        const updated = await shoppingsRepository.updateProductToShopping(shoppingId, productId, quantity, unitPrice)
        return res.status(204).send({ productId: productId ,message: 'Product assignment to shopping updated' })
    }
    // If not, create the assignment
    const newAssignmentId = await shoppingsRepository.addProductToShopping(shoppingId, productId, quantity, unitPrice)
    return res.status(201).send({ productId: productId ,message: 'Product was assigned to the shopping' })
}





const removeProduct = async (req, res) => {
    const shoppingId = Number(req.params.id)
    const productToRemoveName = req.query.productName
    const loggedInUserId = req.user.id 

    const shoppingOfUser = await shoppingsRepository.getShoppingOfUserById(shoppingId, loggedInUserId)

    if(shoppingOfUser == null){
        return res.status(403).send({ message: 'User can only update products of shoppings, which he/she created or is assigned to' })
    }

    // User id was not correcly specified
    if (!productToRemoveName){
        return res.status(400).send({ message: 'Query of productName must be set to specify which product to remove from the shopping' }) 
    }

    const productToRemove = await productsRepository.getProductByName(productToRemoveName)

    if (productToRemove == null){
        return res.status(404).send({ message: 'Product with the specified name was not found' })
    }

    const productAssignmentToRemove = await shoppingsRepository.getProductToShopping(shoppingId, productToRemove.id)

    if (productAssignmentToRemove == null){
        return res.status(404).send({ message: 'Product with the specified name is not assigned to this shopping' })
    }

    const removed = await shoppingsRepository.deleteProductToShopping(shoppingId, productAssignmentToRemove.productId)

    if(!removed){
        return res.status(500).send({ message: 'Removing product from shopping failed' })
    }

    return res.status(200).send()
}






module.exports = {
    getShoppings,
    getShoppingById,
    getProductAssignmentsOfShopping,
    createShopping,
    updateShopping,
    deleteShopping,
    assignUserToShopping,
    unassignUserFromShopping,
    addOrUpdateProduct,
    removeProduct
}