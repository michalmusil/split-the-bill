const database = require('../models/database')

const users = database.users

const login = (req, res) => {
    const { email, password } = req.query
    if (login && password) {
        const foundUser = users.findOne({
            where: {
                email: email
            }
        })
        if (foundUser){
            res.status(200).send('logged in')
        } else {
            res.status(404).send('this user does not exist')
        }
    } else {
        res.status(400).send()
    }
}

module.exports = {
    login
}