const login = (req, res) => {
    const { login, password } = req.query
    if (login && password) {
        res.status(200).send('logged in')
    } else {
        res.status(400).send()
    }
}

module.exports = {
    login
}