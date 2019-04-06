const Book = require("../models/Book");
const requestUtil = require("../util/requestUtil");

const Books = {
    getAllBooks: () => (req, res) => {
        Book.find({})
        .sort({ _id: "ascending" })
        .exec((err, book) => {
            requestUtil.success(res, book);
        });
    },

    createBook: () => (req, res) => {
        const { title, author, isbn, publishedOn, numberOfPages } = req.body;
        Book.create({ title, author, isbn, publishedOn, numberOfPages }, (err, book) => {
            if (err) {
                requestUtil.failed(res, err);
            } else {
                requestUtil.success(res, book);
            }
        });
    },

    getBook: () => (req, res) => {
        Book.findById(req.params.id)
        .exec((err, book) => {
            if (err) {
                requestUtil.failed(res, err);
            } else {
                requestUtil.success(res, book);
            }
        });
    },

    deleteBook: () => (req, res) => {
        Book.deleteOne({ _id:req.params.id })
        .exec((err, book) => {
            if (err) {
                requestUtil.failed(res, err);
            } else {
                requestUtil.success(res, book);
            }
        });
    },

    editBook: () => (req, res) => {
        Book.findById(req.params.id)
        .exec((err, book) => {
            if (err || req.body.title == null) {
                requestUtil.failed(res, err);
            } else {
                book.title = req.body.title;
                book.author = req.body.author;
                book.isbn = req.body.isbn;
                book.publishedOn = req.body.publishedOn;
                book.numberOfPages = req.body.numberOfPages;
                book.save();
                requestUtil.success(res, book);
            }
        }); 
    },

    updateBook: () => (req, res) => {
        Book.findById(req.params.id)
        .exec((err, book) => {
            if (err) {
                requestUtil.failed(res, err);
            } else {
                for(let b in req.body){
                    book[b] = req.body[b];
                }
                book.save();
                requestUtil.success(res, book);
            }
        });
    },
};

module.exports = Books;