var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

// Connect to auto-incrementing db    
autoIncrement.initialize(mongoose.connection);

// Schema for Book
const schema = new Schema(
    {   
        _id: Number,
        title: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: false
        },
        isbn: {
            type: String,
            required: false
        },
        publishedOn: {
            type: Number,
            required: false
        },
        numberOfPages: {
            type: Number,
            required: false
        }
    },
    {
        timestamps: true,
        strict: "throw"
    }
);

// Override default _id to self-incrementing numeric _id

schema.plugin(autoIncrement.plugin, 'Book');
const Book = mongoose.model("Book", schema);

module.exports = Book;