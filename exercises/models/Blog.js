const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: { type: String, minlength: 3, required: true, unique: true },
    author: { type: String, required: true },
    url: { type: String, minlength: 3, required: true },
    likes: { type: Number }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        if (!returnedObject.likes) { returnedObject.likes = 0 }
    }
})

const Blog = mongoose.model('Blog', blogSchema)



module.exports = Blog