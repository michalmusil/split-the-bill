const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const usersRepository = require('../models/repositories/usersRepository')

dotenv.config()

const getAllUsers = async (req, res) => {
    const signedInUserId = req.user.id

    const { searchString, includeSelf, shoppingId } = req.query
    const dontIncludeSelf = includeSelf === 'false' || includeSelf === 'False'
    let excludeUserId = null
    if(dontIncludeSelf){
        excludeUserId = signedInUserId
    }

    const filtered = await usersRepository.getUsers(searchString, shoppingId, excludeUserId)

    res.status(200).send(filtered)
}

const getUserById = async (req, res) => {
    const userId = Number(req.params.id)
    if (userId !== 0 && !userId){
        return res.status(400).send({ message: 'Invalid user id' })
    }
    let user = await usersRepository.getUserById(userId)
    
    if (user == null){
        return res.status(404).send({ message: 'User with this id was not found' })
    }

    return res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email
    })
}

const updateUser = async (req, res) => {
    const { id, username, email, password } = req.body
    
    const loggedInUserId = req.user.id

    if(id !== 0 && !Number(id)){
        return res.status(400).send({ message: 'Invalid user id' })
    }

    // User can update only himself
    if (Number(id) !== loggedInUserId) {
        return res.status(403).send({ message: 'User can only update him/herself' })
    }

    const user = await usersRepository.getUserById(id)
    let newPasswordHash = null

    if (user == null){
        return res.status(404).send({ message: 'User with this id was not found' })
    }
    if(email){
        const existingUserWithEmail = await usersRepository.getUserByEmail(email)    
        if (existingUserWithEmail != null){
            return res.status(409).send({
                message: "This e-mail is already taken"
            })
        }
    }
    if(password){
        const numberOfSaltRounds = 10
        try{
            newPasswordHash = await bcrypt.hash(password, numberOfSaltRounds)
        } catch(ex){
            return res.status(500).send({ message: 'Could not process the new password' })
        }
    }

    const updated = await usersRepository.updateUser(user.id, username, email, newPasswordHash)

    if(!updated){
        return res.status(500).send({ message: "Could not update user" })
    }

    const updatedUser = await usersRepository.getUserById(user.id)

    res.status(200).send({
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email
    })
}

const deleteUser = async (req, res) => {
    const id = Number(req.params.id)
    if(id !== 0 && !id){
        return res.status(400).send({ message: 'Invalid user id' })
    }

    const loggedInUserId = req.user.id

    // User can delete only himself
    if (id !== loggedInUserId) {
        return res.status(403).send({ message: 'User can only delete his/her own account' })
    }

    const deleted = await usersRepository.deleteUser(id)

    if (!deleted){
        return res.status(500).send({ message: 'Could not delete user' })
    }

    res.status(200).send()
}


module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}