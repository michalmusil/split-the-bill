const { user } = require('../config/dbConfig')
const database = require('../models/database')
const { Op } = require('sequelize')

const shoppings = database.shoppings
const userShoppings = database.userShoppings
const users = database.users
const shoppingProducts = database.shoppingProducts


const getShoppingsOfUser = async (req, res) => {
    const loggedInUserId = req.user.id

    const nameQuery = req.query.name

    const include = [
        {
            model: users,
            where: {
                id: loggedInUserId
            }
        }
    ]
    const where = {}

    if (nameQuery != null){
        where.name = { [Op.substring]: nameQuery }
    }

    const foundShoppings = await shoppings.findAll({
        where: where,
        include: include,
        attributes: ['id', 'name', 'dueDateTime', 'description', 'UserId']
    })

    const shoppingsAdjusted = foundShoppings.map(shopping => 
        ({
            id: shopping.id,
            name: shopping.name,
            dueDateTime: shopping.dueDateTime,
            description: shopping.description,
            UserId: shopping.UserId
        })
    )

    return res.status(200).send(shoppingsAdjusted)
}

const getShoppingById = async (req, res) => {
    const shoppingId = Number(req.params.id)

    const loggedInUserId = req.user.id

    if (shoppingId !== 0 && !shoppingId){
        return res.status(400).send({ message: 'Invalid shopping id' })
    }
    let shoppingExists = await shoppings.findOne({
        where: {
            id: shoppingId
        }
    })

    if (shoppingExists == null){
        return res.status(404).send({ message: 'Shopping with this id was not found' })
    }

    let shoppingOfUser = await shoppings.findOne({
        where: {
            id: shoppingId
        },
        include: [
            { 
                model: users,
                where: { id: loggedInUserId }
            }
        ]
    })

    if (shoppingOfUser != null){
        return res.status(200).send({
            id: shoppingOfUser.id,
            name: shoppingOfUser.name,
            dueDateTime: shoppingOfUser.dueDateTime,
            description: shoppingOfUser.description,
            UserId: shoppingOfUser.UserId
        })
    }
    return res.status(403).send({ message: 'You don\'t have permission for this shopping' })
}

const createShopping = async (req, res) => {
    const { name, dueDateTime, description } = req.body

    const loggedInUserId = req.user.id
    let dueDateTimeConverted = null
    if (dueDateTime){
        dueDateTimeConverted = Date.parse(dueDateTime)
    }

    if (name == null){
        return res.status(400).send({ message: 'Shopping must have a name' })
    }

    const newShopping = await shoppings.create({
        name: name,
        dueDateTime: dueDateTimeConverted,
        description: description,
        UserId: loggedInUserId
    })

    if (newShopping == null){
        return res.status(500).send({ message: 'Could not create new shopping' })
    }

    const newUserShoppingConnection = await userShoppings.create({
        userId: loggedInUserId,
        shoppingId: newShopping.id
    })

    if (newUserShoppingConnection == null){
        await newShopping.destroy()
        return res.status(500).send({ message: 'Could not create new shopping' })
    }

    res.status(201).send({
        id: newShopping.id,
        name: newShopping.name,
        dueDateTime: newShopping.dueDateTime,
        description: newShopping.description,
        UserId: newShopping.UserId
    })
}


module.exports = {
    getShoppingsOfUser,
    getShoppingById,
    createShopping
}