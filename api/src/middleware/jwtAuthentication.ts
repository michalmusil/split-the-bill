import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express'

dotenv.config()

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers['authorization'] // Result shoud be: "Bearer theActualToken..."
    if (!authorizationHeader) {
        return res.status(401).send()
    }
    const token = authorizationHeader.split(' ')[1]
    if (!token) {
        return res.status(401).send()
    }
    jwt.verify(token, process.env.JWT_ACCESS_SECRET!, (error, userDecoded) => {
        if (error || !userDecoded) {
            return res.status(401).send()
        }

        if (typeof (userDecoded) == "string") {
            return res.status(401).send()
        }

        const userId = userDecoded["id"] as number || undefined
        const username = userDecoded["username"] as string || undefined
        const email = userDecoded["email"] as string || undefined

        if (!userId || !username || !email) {
            return res.status(401).send()
        }

        req.user = {
            id: userId,
            username: username,
            email: email
        }
        next()
    })
}