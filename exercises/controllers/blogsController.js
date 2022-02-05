const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    return response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

    const body = request.body

    if (!body.title && !body.url) {
        return response.status(400).json({ error: 'Bad Request' })
    }

    const blog = new Blog(request.body)

    const result = await blog.save()
    return response.status(201).json(result)

})

module.exports = blogsRouter