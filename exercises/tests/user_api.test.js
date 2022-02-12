const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)

const User = require('../models/User.js')
const helper = require('./test_helper')

// SET DATABASE
beforeEach(async () => {
    await User.deleteMany({})
    const listObjects = helper.listOfUsers.map(user => new User(user))
    const promiseArray = listObjects.map(user => user.save())
    await Promise.all(promiseArray)
})

describe('User api: READ', () => {

    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
    })

    test('Cantidad correcta de user', async () => {
        const response = await api.get('/api/users')
        expect(response.body).toHaveLength(helper.listOfUsers.length)
    })

    test('En la base de datos el user debe tener los camṕos _id, username, name, passwordHash', async () => {
        const users = await User.find({})
        expect(users[0]._id).toBeDefined()
        expect(users[0].username).toBeDefined()
        expect(users[0].passwordHash).toBeDefined()
        expect(users[0].name).toBeDefined()
    })

    test('En la api el user debe tener los campos username, name, id', async () => {
        const response = await api.get('/api/users')
        expect(response.body[0].id).toBeDefined()
        expect(response.body[0].username).toBeDefined()
        expect(response.body[0].name).toBeDefined()
    })
})

describe('User api: CREATE', () => {

    test('Add new user successfull', async () => {

        const usersBefore = (await User.find({})).length

        const newUser = {
            'name': 'Susana Bossert',
            'username': 'sbossert',
            'password': '5b0553rt',
        }

        const response = await api.
            post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', 'application/json; charset=utf-8')

        //verifico que hay un elemento mas 
        const usersAfter = (await User.find({})).length
        expect(usersAfter).toBe(usersBefore + 1)

        //verifico el objeto devuelto
        expect(response.body.name).toBe(newUser.name)
        expect(response.body.username).toBe(newUser.username)
        // expect(response.body.blogs).toStrictEqual([])

    })

    test('fails because the username must have more than 3 characters', async () => {

        const user = {
            'name': 'usermane to short',
            'password': 'usermaneToShort',
            'username': 'A'
        }
        const response = await api.post('/api/users').send(user)
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')

        expect(response.body.error).toBe('User validation failed: username is shorter than the minimum allowed length (3)')
    })

    test('fails because the password must have more than 3 characters', async () => { 

        const user = {
            'name': 'password to short',
            'username': 'passwordToShort',
            'password': 'A'
        }
        const response = await api.post('/api/users').send(user)
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')

        expect(response.body.error).toBe('User validation failed: password is shorter than the minimum allowed length (3)')
    })

    test('fails because the username was not sent', async () => {
        const user = {
            'name': 'not sent username',
            'password': 'notSentUsername',
        }
        const response = await api.post('/api/users').send(user)
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')

        expect(response.body.error).toBe('User validation failed: username is required')
    })

    test('fails because the username is empty string', async () => {
        const user = {
            'name': 'sent username empty',
            'password': 'sentUsernameEmpty',
            'username':''
        }
        const response = await api.post('/api/users').send(user)
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')

        expect(response.body.error).toBe('User validation failed: username is required')
    })

    test('fails because the password was not sent', async () => {
        const user = {
            'name': 'not sent password',
            'username': 'notSentPassword',
        }
        const response = await api.post('/api/users').send(user)
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')

        expect(response.body.error).toBe('User validation failed: password is required')
    })

    test('Fail because username must be unique', async () => {

        const userOne = {
            'name': 'Sulema Beatriz  Bossert',
            'username': 'sbossert',
            'password': '1234566',
        }

        const userTwo = {
            'name': 'Susana Bossert',
            'username': 'sbossert',
            'password': '5b0553rt',
        }

        expect(userTwo.username).toBe(userOne.username)

        await api.
            post('/api/users')
            .send(userOne)
            .expect(201)
            .expect('Content-Type', 'application/json; charset=utf-8')


        const responseTwo = await api.
            post('/api/users')
            .send(userTwo)
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')

        expect(responseTwo.body.error).toBe('User validation failed: username: Error, expected `username` to be unique. Value: `sbossert`')
    })
})

////////////////////////////////////////////////
afterAll(() => {
    mongoose.connection.close()
})
