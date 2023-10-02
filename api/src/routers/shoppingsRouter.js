const express = require('express')
const controller = require('../controllers/shoppingsController')

const router = express.Router()

router.get('/', controller.getShoppings)
router.get('/:id', controller.getShoppingById)
router.get('/:id/productAssignments', controller.getProductAssignmentsOfShopping)
router.post('/', controller.createShopping)
router.put('/', controller.updateShopping)
router.delete('/:id', controller.deleteShopping)
router.post('/:id/assignUser', controller.assignUserToShopping)
router.delete('/:id/unassignUser', controller.unassignUserFromShopping)
router.post('/:id/addOrUpdateProduct', controller.addOrUpdateProduct)
router.delete('/:id/removeProduct', controller.removeProduct)

module.exports = router