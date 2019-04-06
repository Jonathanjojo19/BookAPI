var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

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

schema.plugin(autoIncrement.plugin, 'Book');
const Book = mongoose.model("Book", schema);

module.exports = Book;