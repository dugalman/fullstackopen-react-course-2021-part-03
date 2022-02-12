const logger = require('../utils/logger')

const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    return response.json(users.map(u => u.toJSON()))
})


usersRouter.post('/', async (request, response, next) => {

    const body = request.body

    if (!body.password) {
        return response.status(400).json({ error: 'User validation failed: password is required' })
    }

    if (!body.username) {
        return response.status(400).json({ error: 'User validation failed: username is required' })
    }

    if (body.password.length < 3) {
        return response.status(400).json({ error: 'User validation failed: password is shorter than the minimum allowed length (3)' })
    }

    if (body.username.length < 3) {
        return response.status(400).json({ error: 'User validation failed: username is shorter than the minimum allowed length (3)' })
    }
    
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })


    try {
        const savedUser = await user.save()
        response.status(201).json(savedUser)
    } catch (error) {
        // logger.error('user::post ', error)
        next(error)
    }
})


module.exports = usersRouter