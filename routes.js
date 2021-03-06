const express = require("express");
const bodyParser = require("body-parser");

const books = require("./endpoints/books");

const router = express.Router();
router.use(bodyParser.json());

router.route("/books/:id").get(books.getBook());
router.route("/books/:id").put(books.updateBook());
router.route("/books/:id").delete(books.deleteBook());
router.route("/books").get(books.getAllBooks());
router.route("/books").post(books.createBook());

module.exports = router;