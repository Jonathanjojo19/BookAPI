const Book = require("../models/Book");
const requestUtil = require("../util/requestUtil");

const Books = {
    // GET all books
    getAllBooks: () => (req, res) => {
        Book.find({})
        .sort({ _id: "ascending" })
        .exec((err, book) => {
            requestUtil.success(res, book);
        });
    },

    // POST a book
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

    // GET a book
    getBook: () => (req, res) => {
        Book.findOne({_id:req.params.id})
        .exec((err, book) => {
            if (err) {
                requestUtil.failed(res, err);
            } else if (book == null) {
                requestUtil.failed(res, "No Item Found");
            } else {
                requestUtil.success(res, book);
            }
        });
    },

    // DELETE a book
    deleteBook: () => (req, res) => {
        Book.findOneAndRemove({_id:req.params.id})
        .exec((err, book) => {
            if (err) {
                requestUtil.failed(res, err);
            } else if (book == null) {
                requestUtil.failed(res, "No Item Found");
            } else {
                requestUtil.success(res, book);
            }
        });
    },

    // PUT a book
    updateBook: () => (req, res) => {
        Book.findOneAndUpdate({_id:req.params.id}, req.body)
        .exec((err, book) => {
            if (err) {
                requestUtil.failed(res, err);
            } else if (book == null) {
                const { title, author, isbn, publishedOn, numberOfPages } = req.body;
                Book.create({ _id:req.params.id, title, author, isbn, publishedOn, numberOfPages }, (err, book) => {
                    if (err) {
                        requestUtil.failed(res, err);
                    } else {
                        requestUtil.success(res, book);
                    }
                });
            } else {
                Book.findOne({_id:req.params.id})
                .exec((err, book) => {
                    requestUtil.success(res, book);
                })
            }
        }); 
    },
};

module.exports = Books;