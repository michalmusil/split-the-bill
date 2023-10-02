const express = require('express')
const controller = require('../controllers/purchasesController')

const router = express.Router()

router.get('/:shoppingId/getByProducts', controller.getPurchasesByProducts)
router.get('/:shoppingId/getByUsers', controller.getPurchasesByUsers)
router.post('/', controller.addOrUpdatePurchase)

module.exports = router