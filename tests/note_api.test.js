const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Note = require('../models/note')


// SET DATABASE
beforeEach(async () => {

  /**
   * A pesar de nuestra uso de la sintaxis async/await, nuestra solución no funciona como esperábamos. ¡La ejecución de la prueba comienza antes de que se inicialice la base de datos!
   * 
   * El problema es que cada iteración del bucle forEach genera su propia operación asincrónica, y beforeEach no esperará a que terminen de ejecutarse. En otras palabras, los comandos await definidos dentro del bucle forEach no están en la función beforeEach, sino en funciones separadas que beforeEach no esperará.
   * 
   * Dado que la ejecución de las pruebas comienza inmediatamente después de que beforeEach haya terminado de ejecutarse, la ejecución de las pruebas comienza antes de que se inicialice el estado de la base de datos.
   * 
   */
  // await Note.deleteMany({})
  // console.log('cleared')

  // helper.initialNotes.forEach(async (note) => {
  //   let noteObject = new Note(note)
  //   await noteObject.save()
  //   console.log('saved')
  // })
  // console.log('done')

  // Una forma de arreglar esto es esperar a que todas las operaciones asincrónicas terminen de ejecutarse con el método Promise.all:
  await Note.deleteMany({})
  const noteObjects = helper.initialNotes.map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  
  /**
   * Aún se puede acceder a los valores devueltos de cada promesa en la matriz cuando se usa el método Promise.all. Si esperamos a que se resuelvan las promesas con la sintaxis "await const results = await Promise.all (promiseArray)"", la operación devolverá una matriz que contiene los valores resueltos para cada promesa en promiseArray, y aparecen en el mismo orden que las promesas en la matr
   */
   const results = await Promise.all(promiseArray)
  console.log(results)
})


describe('PART 04 :api ', () => {

  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(helper.initialNotes.length)
  })


  test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/notes')
    expect(response.body[0].content).toBe('HTML is easy')
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)
    expect(contents).toContain('Browser can execute only Javascript')
  })

  // Escribamos una prueba que agregue una nueva nota y verifique que la cantidad de notas devueltas por la API aumente y que la nota recién agregada esté en la lista.
  test('a valid note can be added', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)
    expect(contents).toContain('async/await simplifies making async calls')
  })

  // Escribamos también una prueba que verifique que una nota sin contenido no se guardará en la base de datos.
  test('note without content is not added', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })
})

// A continuación, escribamos pruebas para obtener una nota individual:
test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb()

  const noteToView = notesAtStart[0]

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

  expect(resultNote.body).toEqual(processedNoteToView)
})

// A continuación, escribamos pruebas para eliminar una nota individual:
test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const notesAtEnd = await helper.notesInDb()
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1)

  const contents = notesAtEnd.map(r => r.content)
  expect(contents).not.toContain(noteToDelete.content)
})

////////////////////////////////////////////////
afterAll(() => {
  mongoose.connection.close()
})
