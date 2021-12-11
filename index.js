const dotenv = require('dotenv');

if (process.env && process.env.NODE_ENV) {
  dotenv.config({ path: '.env.' + process.env.NODE_ENV });
} else {
  dotenv.config();
}

const express = require('express')
const cors = require('cors')
const Note = require('./models/note')

///////////////////////////// EXPRESS ////////////////////////////////////////
const app = express()

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

//////////////////////// MIDLEWARE ////////////////////////////////////////////

app.use(express.static('build'))
app.use(express.json()) // parse los request como json

app.use(cors())
app.use(errorHandler)


///////////////////////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

///////////////////////////////////////////////////////////////////////////////
app.get('/api/notes', (req, res) => {
  Note.find({})
    .then(notes => { res.json(notes) })
    .catch(error => next(error))
})

///////////////////////////////////////////////////////////////////////////////
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  note.save()
    .then(savedNote => { response.json(savedNote) })
    .catch(error => next(error))
})

///////////////////////////////////////////////////////////////////////////////
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) { response.json(note) }
      else { response.status(404).end() }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({error:'malformatted id'})
    })
})

///////////////////////////////////////////////////////////////////////////////
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

///////////////////////////////////////////////////////////////////////////////
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


///////////////// MAIN ////////////////////////////////////////////////////////
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})