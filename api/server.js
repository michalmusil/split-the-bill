const express = require('express')
const authRouter = require('./routers/authRouter')

const app = express()

// Setup
app.use(express.json())
app.use(express.static('./public'))
app.use(express.urlencoded({ extended: true }))



// Routing
app.use('/api/v1/auth', authRouter)




// Run the server
const port = 5050
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})