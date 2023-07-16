const { Op } = require('sequelize')
const database = require('../models/database')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')

dotenv.config()
const users = database.users

const getAllUsers = async (req, res) => {
    let filter = {}

    const signedInUserId = req.user.id

    const { query, includeSelf } = req.query
    if (query){
        filter = {
            [Op.or]: [
                { email : {[Op.substring]: query} },
                { username : {[Op.substring]: query} }
            ]
        }
    }
    if (includeSelf === false) {
        filter.id = {
            [Op.ne]: signedInUserId
        }
    }
    const filtered = await users.findAll({
        where: filter,
        attributes: ['id', 'username', 'email']
    })

    res.status(200).send(filtered)
}

const getUserById = async (req, res) => {
    const userId = Number(req.params.id)
    if (userId !== 0 && !userId){
        return res.status(400).send()
    }
    let user = await users.findOne({
        where: {
            id: userId
        }
    })
    if (user){
        return res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email
        })
    }
    res.status(404).send()
}

const updateUser = async (req, res) => {
    const { id, username, email, password } = req.body
    
    const loggedInUserId = req.user.id

    if(id !== 0 && !Number(id)){
        return res.status(400).send()
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
        return res.status(404).send()
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
            return res.status(400).send()
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
        return res.status(400).send()
    }

    const loggedInUserId = req.user.id

    // User can delete only himself
    if (id !== loggedInUserId) {
        return res.status(403).send()
    }

    const user = await users.findOne({
        where: {
            id: Number(id)
        }
    })

    if (!user){
        return res.status(404).send()
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