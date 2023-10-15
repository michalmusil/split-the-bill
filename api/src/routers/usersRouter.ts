import express from "express"
import UsersController from "../controllers/usersController.js"

const router = express.Router()
const usersController = new UsersController()

router.get('/', usersController.getAllUsers)
// router.get('/:id', controller.getUserById)
// router.put('/', controller.updateUser)
// router.delete('/:id', controller.deleteUser)

export default router