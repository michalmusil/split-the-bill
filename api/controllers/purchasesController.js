const purchasesRepository = require('../models/repositories/purchasesRepository')
const productsRepository = require('../models/repositories/productsRepository')
const shopingsRepository = require('../models/repositories/shoppingsRepository')

const getPurchasesByProducts = async (req, res) => {
    const shoppingId = Number(req.params.shoppingId)
    const { userId } = req.query
    const loggedInUserId = req.user.id
    
    const userIsAuthorized = (await shopingsRepository.getShoppingOfUserById(shoppingId, loggedInUserId)) != null
    if(!userIsAuthorized){
        return res.status(403).send({ message: 'You don\'t have permission to acces this shopping' })
    }

    res.status(100).send()
}




const addOrUpdatePurchase = async (req, res) => {
    const { shoppingId, productId, userId, quantity } = req.body
    const loggedInUserId = req.user.id

    if((!Number(shoppingId) && shoppingId !== 0) || (!Number(productId) && productId !== 0) ||
        (!Number(userId) && userId !== 0) || (!Number(quantity) && quantity !== 0)){
        res.status(400).send({ message: 'shoppingId, productId, userId and quantity are all required' })
    }

    // First checking for valid purchase quantity
    if(quantity < 0) {
        return res.status(400).send({ message: 'Quantity can\'t be lower than 0' })
    }

    // Checking, if requesting user is assigned to or is the creator of the shopping, otherwise he is not authorized for this endpoint
    const requestingUserIsAuthorized = (await shopingsRepository.getShoppingOfUserById(shoppingId, loggedInUserId)) != null
    if(!requestingUserIsAuthorized){
        return res.status(403).send({ message: 'You don\'t have permission to acces this shopping' })
    }

    // Checking, if purchasing user is assigned to or is the creator of the shopping, otherwise he can't purchase anything
    const purchasingUserIsAuthorized = (await shopingsRepository.getShoppingOfUserById(shoppingId, userId)) != null
    if(!purchasingUserIsAuthorized){
        return res.status(403).send({ message: 'The specified user is not assigned to the specified shopping' })
    }

    // Checking, if the shopping has the specified product assigned to it
    const existingProductToShoppingAssignment = await shopingsRepository.getProductToShopping(shoppingId, productId)
    if(existingProductToShoppingAssignment == null){
        return res.status(400).send({ message: 'You can only purchase products, that have already been assigned to shopping' })
    }


    const existingPurchase = await purchasesRepository.getPurchaseByIds(shoppingId, productId, userId)
    
    if(existingPurchase == null && quantity == 0){
        return res.status(400).send({ message: 'User can not purchase 0 quantity of the given product' })
    }
    // If the purchase already exists and quantity is 0, the purchase is deleted
    if(existingPurchase != null && quantity == 0){
        const deleted = await purchasesRepository.deletePurchase(shoppingId, productId, userId)
        if(!deleted){
            return res.status(500).send({ message: 'Could not delete purchase' })
        } 
        return res.status(200).send({ message: 'Purchase was deleted (because quantity was set to zero)' })
    }

    // Catching the case, when user updates quantity of the purchase to be lower (needs to happen before checking the remaining purchases)
    if(existingPurchase != null && quantity < existingPurchase.quantity) {
        const updated = await purchasesRepository.updateExistingPurchase(shoppingId, productId, userId, quantity)
        if(!updated){
            return res.status(500).send({ message: 'Could not update purchase' })
        } 
        return res.status(204).send({ message: 'Purchase was updated' })
    }

    // Catching the case, when user tries to purchase more quantity, than there is remaining of the given product (taking purchases of the same product by other users into account)
    const { remaining } = await purchasesRepository.getProductRemainingPurchases(productId, shoppingId)
    if((existingPurchase == null && remaining < quantity) || (existingPurchase != null && (remaining + existingPurchase.quantity) < quantity)) {
        return res.status(400).send({ message: 'You can\'t purchase more of the product than is assigned to the shopping' })
    }


    if(existingPurchase != null){
        const updated = await purchasesRepository.updateExistingPurchase(shoppingId, productId, userId, quantity)
        if(!updated){
            return res.status(500).send({ message: 'Could not update purchase' })
        } 
        return res.status(204).send({ message: 'Purchase was updated' })
    }

    const createdId = await purchasesRepository.addNewPurchase(shoppingId, productId, userId, quantity)
    return res.status(201).send({ message: 'Purchase was created' })
}











module.exports = {
    getPurchasesByProducts,
    addOrUpdatePurchase
}