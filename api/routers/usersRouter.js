const express = require('express')
const controller = require('../controllers/usersController')

const router = express.Router()

router.get('/', controller.getAllUsers)
router.get('/:id', controller.getUserById)
router.put('/', controller.updateUser)
router.delete('/:id', controller.deleteUser)


module.exports = router