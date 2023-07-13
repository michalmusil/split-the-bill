const express = require('express')
const authRouter = require('./routers/authRouter')

const app = express()

app.use(express.static('./public'))



// Routing
app.use('/api/v1', authRouter)


app.listen(port = 5050)