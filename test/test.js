process.env.NODE_ENV = 'test';

let Book = require('../models/Book');
let app = require('../app');

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('Books', function() {
	this.timeout(5000);
	beforeEach((done) => { 
		Book.remove({}, (err) => { 
			done();
		});
	});
	
	describe('/GET book', () => {
		this.timeout(15000);
		it('it should GET all the books', (done) => {
			chai.request(app)
			.get('/books/')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.data.should.be.a('array');
				res.body.data.length.should.be.eql(0);
				done();
			});
		});
	});

	describe('/POST book', () => {
		it('it should POST a book ', (done) => {
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

	describe('/GET/:id book', () => {
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
	});

	describe('/DELETE/:id book', () => {
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
					// res.body.should.have.property("success").eql(true);
					// res.body.data.should.have.property('ok').eql(1);
					// res.body.data.should.have.property('n').eql(1);
					done();
				});
			});
		});
	});

	describe('/PUT/:id book', () => {
		it('it should UPDATE a book given the id', (done) => {
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
	});

	describe('/PATCH/:id book', () => {
		it('it should PATCH a book given the id', (done) => {
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
	});
});
  