const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    return response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

    const body = request.body

    if (!body.title) {
        return response.status(400).json({ error: 'Blog validation failed: title is required' })
    }
    
    if (!body.url) {
        return response.status(400).json({ error: 'Blog validation failed: url is required' })
    }

    if (!body.likes) {
        body.likes = 0
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: body.user
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})
  
blogsRouter.put('/:id', async (request, response) => {

    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter