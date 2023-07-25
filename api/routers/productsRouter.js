const express = require('express')
const controller = require('../controllers/productsController')

const router = express.Router()

router.get('/', controller.getProducts)
router.get('/:id', controller.getProductById)
router.post('/', controller.addProduct)
//router.delete('/:id', controller.deleteProduct)

module.exports = router