import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import UsersRepository from '../repositories/usersRepository.js'
import { Request, Response } from 'express'
import SessionUser from 'models/sessionUser.js'

dotenv.config()

const usersRepository = new UsersRepository();

export async function login(req: Request, res: Response) {
    const email = req.body["email"] as string | undefined
    const password = req.body["password"] as string | undefined

    if (!email || !password){
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

    const userForToken: SessionUser = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email
    }

    const accessToken = jwt.sign(userForToken, process.env.JWT_ACCESS_SECRET!, { expiresIn: '10d' })

    res.status(200).send({
        user: userForToken,
        token: accessToken
    })
}

export async function register(req: Request, res: Response) {
    const username = req.body["username"] as string | undefined
    const email = req.body["email"] as string | undefined
    const password = req.body["password"] as string | undefined

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
        return res.status(500).send({ message: 'Something went wrong while creating the user' })
    }

    const newUserId = await usersRepository.addUser(username, email, passwordHash)
    if(newUserId == null){
        return res.status(500).send({ message: 'Something went wrong while creating the user' })
    }

    const newUser = await usersRepository.getUserById(newUserId)
    
    res.status(201).send({
        id: newUser!.id,
        username: newUser!.username,
        email: newUser!.email
    })
}