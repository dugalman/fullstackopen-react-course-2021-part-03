const mongoose = require('mongoose')
const supertest = require('supertest')

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

    test('Cantidad correcta de blog', async() =>{
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(6)
    })

})

////////////////////////////////////////////////
afterAll(() => {
    mongoose.connection.close()
})
