import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const authenticate = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'] // Result shoud be: "Bearer theActualToken..."
    if (authorizationHeader == null) {
        return res.status(401).send()
    }   
    const token = authorizationHeader.split(' ')[1]
    if (token == null) {
        return res.status(401).send()
    }
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (error, userDecoded) => {
        if(error){
            return res.status(401).send()
        }

        req.user = {
            id: userDecoded.id,
            username: userDecoded.username,
            email: userDecoded.email
        }
        next()
    })
} 

module.exports = authenticate