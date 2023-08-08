const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

const jwtAuthentication = require('./middleware/jwtAuthentication')
const authRouter = require('./routers/authRouter')
const usersRouter = require('./routers/usersRouter')
const productsRouter = require('./routers/productsRouter')
const shoppingsRouter = require('./routers/shoppingsRouter')
const purchasesRouter = require('./routers/purchasesRouter')

const app = express()
dotenv.config()

// Setup
app.use(express.json())
app.use(express.static('./public'))
app.use(express.urlencoded({ extended: true }))
app.use(cors())



// Routing - unauthenticated endpoints
app.use('/api/v1/auth', authRouter)


// Routing - authenticated endpoints
app.use(jwtAuthentication)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/products', productsRouter)
app.use('/api/v1/shoppings', shoppingsRouter)
app.use('/api/v1/purchases', purchasesRouter)




// Run the server
const port = 5050
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})