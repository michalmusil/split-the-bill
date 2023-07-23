const express = require('express')
const controller = require('../controllers/shoppingsController')

const router = express.Router()

router.get('/', controller.getShoppingsOfUser)
router.get('/:id', controller.getShoppingById)
router.post('/', controller.createShopping)
//router.delete('/:id', controller.deleteProduct)

module.exports = router