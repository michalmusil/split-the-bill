const express = require('express')
const controller = require('../controllers/authController')

const router = express.Router()

router.get('/login', controller.login)


module.exports = router