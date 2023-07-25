const express = require('express')
const controller = require('../controllers/shoppingsController')

const router = express.Router()

router.get('/', controller.getShoppings)
router.get('/:id', controller.getShoppingById)
router.post('/', controller.createShopping)
router.put('/', controller.updateShopping)
router.delete('/:id', controller.deleteShopping)
router.post('/:id/assignUser', controller.assignUserToShopping)
router.post('/:id/addOrUpdateProduct', controller.addOrUpdateProduct)
router.delete('/:id/removeProduct', controller.removeProduct)

module.exports = router