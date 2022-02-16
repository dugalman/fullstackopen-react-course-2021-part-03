const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    author: { type: String },
    url: {
        type: String,
        minlength: 3,
        required: true
    },
    likes: Number,
    user: String
})


blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        if (!returnedObject.likes) { returnedObject.likes = 0 }
    }
})

blogSchema.plugin(uniqueValidator)
const Blog = mongoose.model('Blog', blogSchema)



module.exports = Blog