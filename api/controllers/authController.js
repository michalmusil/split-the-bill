const database = require('../models/database')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')

dotenv.config()
const users = database.users

const login = async (req, res) => {
    const { email, password } = req.body

    if (email == null || password == null){
        return res.status(400).send()
    }

    const foundUser = await users.findOne({
        where: {
            email: email
        }
    })

    if (foundUser == null){
        return res.status(401).send()
    }

    let passwordValid = false
    try{
        passwordValid = await bcrypt.compare(password, foundUser.passwordHash)
    } catch(ex){
        return res.status(401).send()
    }

    if (!passwordValid){
        return res.status(401).send()
    }

    const userForToken = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email
    }

    const accessToken = jwt.sign(userForToken, process.env.JWT_ACCESS_SECRET, { expiresIn: '10d' })

    res.status(200).send({
        user: userForToken,
        token: accessToken
    })
}

const register = async (req, res) => {
    const { username, email, password } = req.body

    if (!(username && email && password)){
        return res.status(400).send()
    }

    const existingUserWithEmail = await users.findOne({
        where: {
            email: email
        }
    })

    if (existingUserWithEmail != null){
        return res.status(409).send(
            {
                message: "This e-mail is already taken"
            }
        )
    }
    
    let passwordHash = ""
    try{
        const numberOfSaltRounds = 10
        passwordHash = await bcrypt.hash(password, numberOfSaltRounds)
    } catch(ex){
        return res.status(400).send()
    }

    const newUser = await users.create({
        username: username,
        email: email,
        passwordHash: passwordHash
    })
    res.status(201).send(newUser)
}

module.exports = {
    login,
    register
}