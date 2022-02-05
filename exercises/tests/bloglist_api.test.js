const mongoose = require('mongoose')
const supertest = require('supertest')


const app = require('../app')
const api = supertest(app)

const Blog = require('../models/Blog.js')
const helper = require('./test_helper')

// SET DATABASE
beforeEach(async () => {
    await Blog.deleteMany({})
    const listObjects = helper.listOfBlogs.map(blog => new Blog(blog))
    const promiseArray = listObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})


describe('PART 04 :api blog', () => {

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')

    })

    test('Cantidad correcta de blog', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.listOfBlogs.length)
    })

    test('En la base de datos el blog debe tener un identificador llamado _id', async () => {
        const blogs = await Blog.find({})
        expect(blogs[0]._id).toBeDefined()
    })

    test('En la api el bog debe tener un identificador llamado id', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })

    test('Agregar un nuevo blog', async () => {


        const blogsBefore = (await Blog.find({})).length

        const newBlog = {
            'title': 'titulo 1',
            'author': 'damian mac dougall',
            'url': 'www.yahoo.com',
            'likes': 9
        }
        const response = await api.
            post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', 'application/json; charset=utf-8')

        //verifico que hay un elemento mas 
        const blogsAfter = (await Blog.find({})).length
        expect(blogsAfter).toBe(blogsBefore + 1)

        //verifico el objeto devuelto
        expect(response.body.title).toBe(newBlog.title)
        expect(response.body.author).toBe(newBlog.author)
        expect(response.body.url).toBe(newBlog.url)
    })


    test('propiedad likes por defecto con valor 0', async () => {
        const response = await api.get('/api/blogs')
        const ID = '5a422a851b54a676234d17f6'

        const blog = response.body.find(b => b.id === ID)

        expect(blog.id).toBe(ID)
        expect(response.body[0].likes).toBeDefined()
        expect(response.body[0].likes).toBe(0)

    })

})

////////////////////////////////////////////////
afterAll(() => {
    mongoose.connection.close()
})
