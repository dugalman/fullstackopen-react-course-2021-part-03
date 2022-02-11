const logger = require('../utils/logger')

const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (request, response) => {
    const blogs = await User.find({})
    return response.json(blogs)
})


usersRouter.post('/', async (request, response,next) => {

    const body = request.body

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
        logger.error('user::post ',error)
        next(error)
    }


})


module.exports = usersRouter