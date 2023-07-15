const express = require('express')

const authRouter = require('./routers/authRouter')
const usersRouter = require('./routers/usersRouter')

const app = express()

// Setup
app.use(express.json())
app.use(express.static('./public'))
app.use(express.urlencoded({ extended: true }))



// Routing
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', usersRouter)




// Run the server
const port = 5050
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})