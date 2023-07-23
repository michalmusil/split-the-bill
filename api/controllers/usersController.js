const { Op } = require('sequelize')
const database = require('../models/database')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')

dotenv.config()
const users = database.users
const shoppings = database.shoppings

const getAllUsers = async (req, res) => {
    let where = {}
    let include = []

    const signedInUserId = req.user.id

    const { searchString, includeSelf, shoppingId } = req.query
    const shoppingIdNumber = Number(shoppingId)
    const dontIncludeSelf = includeSelf === 'false' || includeSelf === 'False'

    if (searchString != null){
        where = {
            [Op.or]: [
                { email : {[Op.substring]: searchString} },
                { username : {[Op.substring]: searchString} }
            ]
        }
    }
    if (dontIncludeSelf) {
        where.id = {
            [Op.ne]: signedInUserId
        }
    }
    if (shoppingIdNumber || shoppingIdNumber === 0){
        include.push({
            model: shoppings,
            where: {
                id: shoppingIdNumber
            }
        })
    }


    const filtered = await users.findAll({
        where: where,
        include: include,
        attributes: ['id', 'username', 'email']
    })

    res.status(200).send(filtered)
}

const getUserById = async (req, res) => {
    const userId = Number(req.params.id)
    if (userId !== 0 && !userId){
        return res.status(400).send({ message: 'Invalid user id' })
    }
    let user = await users.findOne({
        where: {
            id: userId
        }
    })
    if (user != null){
        return res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email
        })
    }
    return res.status(404).send({ message: 'User with this id was not found' })
}

const updateUser = async (req, res) => {
    const { id, username, email, password } = req.body
    
    const loggedInUserId = req.user.id

    if(id !== 0 && !Number(id)){
        return res.status(400).send({ message: 'Invalid user id' })
    }

    // User can update only himself
    if (Number(id) !== loggedInUserId) {
        return res.status(403).send()
    }

    const user = await users.findOne({
        where: {
            id: Number(id)
        }
    })

    if (!user){
        return res.status(404).send({ message: 'User with this id was not found' })
    }

    if(username){
        user.username = username
    }
    if(email){
        const existingUserWithEmail = await users.findOne({
            where: {
                email: email
            }
        })
    
        if (existingUserWithEmail != null){
            return res.status(409).send({
                message: "This e-mail is already taken"
            })
        } else {
            user.email = email
        }
    }
    if(password){
        const numberOfSaltRounds = 10
        try{
            const newPasswordHash = await bcrypt.hash(password, numberOfSaltRounds)
            user.passwordHash = newPasswordHash
        } catch(ex){
            return res.status(500).send({ message: 'Could not process the new password' })
        }
    }

    await user.save()

    res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email
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

    const user = await users.findOne({
        where: {
            id: Number(id)
        }
    })

    if (!user){
        return res.status(404).send({ message: 'User with this id was not found' })
    }

    await user.destroy()
    res.status(200).send()
}


module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}