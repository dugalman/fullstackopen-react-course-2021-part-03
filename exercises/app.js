const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

const express = require('express')
const app = express()
const cors = require('cors')


const blogsRouter = require('./controllers/BlogsController')


const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)
logger.info(`Connect mongo server ${mongoUrl}`)

app.use(cors())
app.use(express.json())

app.use('/api/blogs',blogsRouter)

module.exports = app