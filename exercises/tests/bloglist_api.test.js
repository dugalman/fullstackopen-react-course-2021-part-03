const res = require('express/lib/response')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/Blog.js')

const app = require('../app')
const api = supertest(app)

// SET DATABASE
beforeEach(async () => {

    // await Note.deleteMany({})
    // const noteObjects = helper.initialNotes.map(note => new Note(note))
    // const promiseArray = noteObjects.map(note => note.save())
    // await Promise.all(promiseArray)
})


describe('PART 04 :api ', () => {

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')

    })

    test('Cantidad correcta de blog', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(6)
    })

    test('The unique identifier property of the blog posts is by default _id', async () => {
        const blogs = await Blog.find({})
        expect(blogs[0]._id).toBeDefined()
    })

    test('The blog must be id property', async () => {
        const response = await api.get('/api/blogs')
        console.log(response.body[0])
        expect(response.body[0].id).toBeDefined()
    })

})

////////////////////////////////////////////////
afterAll(() => {
    mongoose.connection.close()
})
