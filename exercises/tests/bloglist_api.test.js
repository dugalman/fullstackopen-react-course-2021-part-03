const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)

const Blog = require('../models/Blog.js')
const User = require('../models/User.js')
const helper = require('./test_helper')

// SET DATABASE
beforeEach(async () => {
    await Blog.deleteMany({})
    const listObjectsBlogs = helper.listOfBlogs.map(blog => new Blog(blog))
    const promiseArrayBlogs = listObjectsBlogs.map(blog => blog.save())
    await Promise.all(promiseArrayBlogs)
})


describe('Blog api: CREATE', () => {

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
            'likes': 98
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
        expect(response.body.likes).toBe(98)
    })

    test('Agregar un nuevo blog sin la propiedad like', async () => {
        const blogsBefore = (await Blog.find({})).length

        const newBlog = {
            'title': 'titulo 1',
            'author': 'damian mac dougall',
            'url': 'www.yahoo.com',
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
        expect(response.body.likes).toBe(0)
    })

    test('Propiedad likes por defecto con valor 0', async () => {

        //cuando lo creo 
        const newBlog = await api.
            post('/api/blogs')
            .send({'title': 'SIN LIKES','author': 'damian mac dougall','url': 'www.yahoo.com',})
            .expect(201)
            .expect('Content-Type', 'application/json; charset=utf-8')

        expect(newBlog.body.likes).toBe(0)

        //cuando leo
        const response = await api.get('/api/blogs')
        const ID = newBlog.body.id

        const blog = response.body.find(b => b.id === ID)
        expect(blog.id).toBe(ID)
        expect(blog.likes).toBeDefined()
        expect(blog.likes).toBe(0)
    })

    test('Responde code 400 por falta de title y url al agregar un nuevo blog', async () => {
        const newBlog = {
            'author': 'damian mac dougall',
            'likes': 99
        }
        await api.
            post('/api/blogs')
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
    })

    describe('Blog api :: Update a blog', () => {

        test('Blog update successful ', async () => {
            const unBlogAActualizar = helper.listOfBlogs[1]
            const ID = unBlogAActualizar._id
            
            //incremento la cantidad de likes
            const updatedBlog = {
                ...unBlogAActualizar,
                likes: unBlogAActualizar.likes + 1
            }

            //busco el registro actual
            const response = await api
                .put(`/api/blogs/${ID}`)
                .send(updatedBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            //reviso en la base
            const blogsAtEnd = await Blog.findById(ID)
            expect(blogsAtEnd._id.toString()).toBe(ID)
            expect(blogsAtEnd.likes).toBe(unBlogAActualizar.likes+1)
            expect(blogsAtEnd.likes).toBe(response.body.likes)
        })
    })

    describe('Deletion of a blog', () => {
        test('Succesull delete with status 204', async () => {
            const unBlogABorrar = helper.listOfBlogs[1]

            await api.delete(`/api/blogs/${unBlogABorrar._id}`)
                .expect(204)

            const todosLosBlogs = (await Blog.find({}))
            expect(todosLosBlogs).toHaveLength(helper.listOfBlogs.length - 1)
        })
    })

})



////////////////////////////////////////////////
afterAll(() => {
    mongoose.connection.close()
})
