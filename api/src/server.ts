import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import { authenticate } from './middleware/jwtAuthentication.js'
import authRouter from './routers/authRouter.js'
import usersRouter from './routers/usersRouter.js'
// const productsRouter = require('./routers/productsRouter')
// const shoppingsRouter = require('./routers/shoppingsRouter')
// const purchasesRouter = require('./routers/purchasesRouter')

const app = express()
dotenv.config()

// Setup
app.use(express.json())
app.use(express.static('./public'))
app.use(express.urlencoded({ extended: true }))
app.use(cors())



// // Routing - unauthenticated endpoints
app.use('/api/v1/auth', authRouter)


// // Routing - authenticated endpoints
app.use(authenticate)
app.use('/api/v1/users', usersRouter)
// app.use('/api/v1/products', productsRouter)
// app.use('/api/v1/shoppings', shoppingsRouter)
// app.use('/api/v1/purchases', purchasesRouter)




// Run the server
const port: number = 5050
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})