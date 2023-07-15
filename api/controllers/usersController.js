const { Op } = require('sequelize')
const database = require('../models/database')

const users = database.users

const getAllUsers = async (req, res) => {
    let filter = {}

    const { query, includeSelf } = req.query
    if (query){
        filter = {
            [Op.or]: [
                { email : {[Op.substring]: query} },
                { username : {[Op.substring]: query} }
            ]
        }
    }
    /*
    if (includeSelf) {
        filter.id = {
            [Op.ne]: userId
        }
    }
    */
    const filtered = await users.findAll({
        where: filter
    })

    res.status(200).send(filtered)
}

const getUserById = async (req, res) => {
    const userId = Number(req.params.id)
    if (userId !== 0 && !userId){
        res.status(400).send()
        return
    }
    let user = await users.findOne({
        where: {
            id: userId
        }
    })
    if (user){
        res.status(200).send(user)
        return
    }
    res.status(404).send()
}

const addUser = async (req, res) => {
    const { username, email, password } = req.body
    
    const passwordHash = password

    if (username && email && password){
        const newUser = await users.create({
            username: username,
            email: email,
            passwordHash: passwordHash
        })
        res.status(201).send(newUser)
        return
    }
    res.status(400).send()
}

const updateUser = async (req, res) => {
    const { id, username, email, password } = req.body
    const loggedInUserId = 4

    if(id !== 0 && !Number(id)){
        res.status(400).send()
        return
    }

    // User can update only himself
    if (Number(id) !== loggedInUserId) {
        res.status(403).send()
        return
    }

    const user = await users.findOne({
        where: {
            id: Number(id)
        }
    })

    if (!user){
        res.status(404).send()
        return
    }

    if(username){
        user.username = username
    }
    if(email){
        user.email = email
    }
    if(password){
        const newPasswordHash = password
        user.passwordHash = newPasswordHash
    }

    await user.save()

    res.status(200).send(user)
}

const deleteUser = async (req, res) => {
    const id = Number(req.params.id)
    if(id !== 0 && !id){
        res.status(400).send()
        return
    }

    const loggedInUserId = 4

    // User can delete only himself
    if (id !== loggedInUserId) {
        res.status(403).send()
        return
    }

    const user = await users.findOne({
        where: {
            id: Number(id)
        }
    })

    if (!user){
        res.status(404).send()
        return
    }

    await user.destroy()
    res.status(200).send()

}


module.exports = {
    getAllUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser
}