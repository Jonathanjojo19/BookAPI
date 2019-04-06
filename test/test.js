process.env.NODE_ENV = 'test';

let Book = require('../models/Book');
let app = require('../app');

let sinon = require('sinon');
let request = require('request');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

let books = require("./fixtures/books.json");

const base = 'http://localhost:3000';

chai.use(chaiHttp);

describe('Books', function() {
	this.timeout(5000);
	beforeEach((done) => { 
		Book.remove({}, (err) => { 
			done();
		});
	});
	
	describe('/GET/books/', () => {
		it('it should GET an array of length 0 when there is no book', (done) => {
			chai.request(app)
			.get('/books/')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.data.should.be.a('array');
				res.body.data.length.should.be.eql(0);
				done();
			});
		});

		it('it should GET all books', (done) => {
			let book1 = new Book({ 
				title: "TITLE", 
				author: "AUTHOR", 
				isbn: "12345", 
				publishedOn: 2019,
				numberOfPages: 100 
			});
			book1.save((err, book) => {
				chai.request(app)
				.get('/books/')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.data.should.be.a('array');
					res.body.data.length.should.be.eql(1);
					done();
				});
			});
		});
	});

	describe('/GET/books/:id book', () => {
		it('it should GET a book by the given id', (done) => {
			let book = new Book({ 
				title: "TITLE", 
				author: "AUTHOR", 
				isbn: "12345", 
				publishedOn: 2019,
				numberOfPages: 100 
			});
			book.save((err, book) => {
				chai.request(app)
				.get('/books/' + book.id)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("success").eql(true);
					res.body.data.should.have.property('title').eql("TITLE");
					res.body.data.should.have.property('author').eql("AUTHOR");
					res.body.data.should.have.property('isbn').eql("12345");
					res.body.data.should.have.property('publishedOn').eql(2019);
					res.body.data.should.have.property('numberOfPages').eql(100);
					res.body.data.should.have.property('_id').eql(parseInt(book.id));
					res.body.data.should.have.property('createdAt');
					res.body.data.should.have.property('updatedAt');
					done();
				});
			});
		});

		it('it should return unsuccessful response when getting with malformed id', (done) => {
			let book = new Book({ 
				title: "TITLE", 
				author: "AUTHOR", 
				isbn: "12345", 
				publishedOn: 2019,
				numberOfPages: 100 
			});
			book.save((err, book) => {
				chai.request(app)
				.get('/books/' + 'NaN-book-id')
				.end((err, res) => {
					res.should.have.status(500);
					res.body.should.have.property("success").eql(false);
					res.body.message.should.have.property("name").eql("CastError");
					done();
				});
			});
		})
	});

	describe('/POST/books/', () => {
		it('it should POST a book and return the book', (done) => {
			let book = {
				"title" : "TITLE",
				"author" : "AUTHOR",
				"isbn": "12345",
				"publishedOn": 2019,
				"numberOfPages": 100
			}
			chai.request(app)
			.post('/books/')
			.send(book)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.have.property("success").eql(true);
				res.body.data.should.have.property('title').eql("TITLE");
				res.body.data.should.have.property('author').eql("AUTHOR");
				res.body.data.should.have.property('isbn').eql("12345");
				res.body.data.should.have.property('publishedOn').eql(2019);
				res.body.data.should.have.property('numberOfPages').eql(100);
				res.body.data.should.have.property('_id');
				res.body.data.should.have.property('createdAt');
				res.body.data.should.have.property('updatedAt');
				done();
			});
		});
		
		it('it should not POST a book without title field', (done) => {
			let book = {
				"author" : "AUTHOR",
				"isbn": "12345",
				"publishedOn": 2019,
				"numberOfPages": 100
			}
			chai.request(app)
			.post('/books/')
			.send(book)
			.end((err, res) => {
				res.should.have.status(500);
				res.body.should.have.property('success').eql(false);
				res.body.message.errors.title.should.have.property('kind').eql('required');
			done();
			});
		});
	});

	describe('/DELETE/books/:id book', () => {
		it('it should DELETE a book given the id', (done) => {
			let book = new Book({ 
				title: "TITLE", 
				author: "AUTHOR", 
				isbn: "12345", 
				publishedOn: 2019,
				numberOfPages: 100 
			});
			book.save((err, book) => {
				chai.request(app)
				.delete('/books/' + book.id)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("success").eql(true);
					res.body.data.should.have.property('ok').eql(1);
					res.body.data.should.have.property('n').eql(1);
					done();
				});
			});
		});

		it('it should return unsuccessful response when deleting with malformed id', (done) => {
			let book = new Book({ 
				title: "TITLE", 
				author: "AUTHOR", 
				isbn: "12345", 
				publishedOn: 2019,
				numberOfPages: 100 
			});
			book.save((err, book) => {
				chai.request(app)
				.delete('/books/' + 'NaN-book-id')
				.end((err, res) => {
					res.should.have.status(500);
					res.body.should.have.property("success").eql(false);
					res.body.message.should.have.property("name").eql("CastError");
					done();
				});
			});
		})
	});

	describe('/PUT/books/:id book', () => {
		it('it should UPDATE a book given the id and return the book', (done) => {
			let book = new Book({ 
				title: "TITLE", 
				author: "AUTHOR", 
				isbn: "12345", 
				publishedOn: 2019,
				numberOfPages: 100 
			});
			book.save((err, book) => {
				let newbook = {
					"title" : "NEW TITLE",
					"author" : "NEW AUTHOR",
					"isbn": "12345",
					"publishedOn": 2019,
					"numberOfPages": 100
				}
				chai.request(app)
				.put('/books/' + book.id)
				.send(newbook)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("success").eql(true);
					res.body.data.should.have.property('title').eql("NEW TITLE");
					res.body.data.should.have.property('author').eql("NEW AUTHOR");
					res.body.data.should.have.property('isbn').eql("12345");
					res.body.data.should.have.property('publishedOn').eql(2019);
					res.body.data.should.have.property('numberOfPages').eql(100);
					res.body.data.should.have.property('_id').eql(parseInt(book.id));
					res.body.data.should.have.property('createdAt');
					res.body.data.should.have.property('updatedAt');
					done();
				});
			});
		});

		it('it should not PUT a book without title field', (done) => {
			let book = new Book({ 
				title: "TITLE", 
				author: "AUTHOR", 
				isbn: "12345", 
				publishedOn: 2019,
				numberOfPages: 100 
			});
			book.save((err, book) => {
				let newbook = {
					"author" : "NEW AUTHOR",
					"isbn": "12345",
					"publishedOn": 2019,
					"numberOfPages": 100
				}
				chai.request(app)
				.put('/books/' + book.id)
				.send(newbook)
				.end((err, res) => {
					res.should.have.status(500);
					res.body.should.have.property('success').eql(false);
					done();
				});
			});
		});

		it('it should return unsuccessful response when updating with malformed id', (done) => {
			let book = new Book({ 
				title: "TITLE", 
				author: "AUTHOR", 
				isbn: "12345", 
				publishedOn: 2019,
				numberOfPages: 100 
			});
			book.save((err, book) => {
				chai.request(app)
				.put('/books/' + 'NaN-book-id')
				.end((err, res) => {
					res.should.have.status(500);
					res.body.should.have.property("success").eql(false);
					res.body.message.should.have.property("name").eql("CastError");
					done();
				});
			});
		})
	});

	describe('/PATCH/books/:id book', () => {
		it('it should PATCH a book given the id and return the book', (done) => {
			let book = new Book({ 
				title: "TITLE", 
				author: "AUTHOR", 
				isbn: "12345", 
				publishedOn: 2019,
				numberOfPages: 100 
			});
			book.save((err, book) => {
				let newbook = {
					"title" : "NEW TITLE",
				}
				chai.request(app)
				.patch('/books/' + book.id)
				.send(newbook)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("success").eql(true);
					res.body.data.should.have.property('title').eql("NEW TITLE");
					res.body.data.should.have.property('author').eql("AUTHOR");
					res.body.data.should.have.property('isbn').eql("12345");
					res.body.data.should.have.property('publishedOn').eql(2019);
					res.body.data.should.have.property('numberOfPages').eql(100);
					res.body.data.should.have.property('_id').eql(parseInt(book.id));
					res.body.data.should.have.property('createdAt');
					res.body.data.should.have.property('updatedAt');
					done();
				});
			});
		});

		it('it should return unsuccessful response when patching with malformed id', (done) => {
			let book = new Book({ 
				title: "TITLE", 
				author: "AUTHOR", 
				isbn: "12345", 
				publishedOn: 2019,
				numberOfPages: 100 
			});
			book.save((err, book) => {
				chai.request(app)
				.patch('/books/' + 'NaN-book-id')
				.end((err, res) => {
					res.should.have.status(500);
					res.body.should.have.property("success").eql(false);
					res.body.message.should.have.property("name").eql("CastError");
					done();
				});
			});
		})
	});
});