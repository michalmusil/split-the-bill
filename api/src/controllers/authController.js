const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const usersRepository = require('../models/repositories/usersRepository')

dotenv.config()

const login = async (req, res) => {
    const { email, password } = req.body

    if (email == null || password == null){
        return res.status(400).send({ message: 'You must input both email and password' })
    }

    const foundUser = await usersRepository.getUserByEmail(email)

    if (foundUser == null){
        return res.status(401).send({ message: 'Unauthorized' })
    }

    let passwordValid = false
    try{
        passwordValid = await bcrypt.compare(password, foundUser.passwordHash)
    } catch(ex){
        return res.status(401).send({ message: 'Unauthorized' })
    }

    if (!passwordValid){
        return res.status(401).send({ message: 'Unauthorized' })
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

    const existingUserWithEmail = await usersRepository.getUserByEmail(email)

    if (existingUserWithEmail != null){
        return res.status(409).send({ message: "This e-mail is already taken" })
    }
    
    let passwordHash = ""
    try{
        const numberOfSaltRounds = 10
        passwordHash = await bcrypt.hash(password, numberOfSaltRounds)
    } catch(ex){
        return res.status(500).send({ message: 'Could not process the new password' })
    }

    const newUserId = await usersRepository.addUser(username, email, passwordHash)
    const newUser = await usersRepository.getUserById(newUserId)
    
    res.status(201).send({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
    })
}

module.exports = {
    login,
    register
}