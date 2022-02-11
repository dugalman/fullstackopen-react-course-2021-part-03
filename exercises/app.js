const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

const express = require('express')
const app = express()
const cors = require('cors')


const blogsRouter = require('./controllers/blogsController')
const usersRouter = require('./controllers/usersController')


const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)
logger.info(`Connect mongo server ${mongoUrl}`)

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use(function(req, res, next){
    res.setTimeout(120000, function(){
        console.log('Request has timed out.')
        res.send(408)
    })
    next()
})

app.use('/api/blogs',blogsRouter)
app.use('/api/users',usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app