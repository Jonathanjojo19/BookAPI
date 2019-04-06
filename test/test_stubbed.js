process.env.NODE_ENV = 'test';

let Book = require('../models/Book');
let sinon = require('sinon');
let request = require('request');
let chai = require('chai');
let should = chai.should();
let books = require("./fixtures/books.json");
const base = 'http://localhost:3000';

describe('Books', function() {
	this.timeout(5000);
	beforeEach((done) => { 
		
		this.get = sinon.stub(request, 'get');
		this.post = sinon.stub(request, 'post');
		this.put = sinon.stub(request, 'put');
        this.delete = sinon.stub(request, 'delete');
        this.patch = sinon.stub(request, 'patch');
	
		Book.remove({}, (err) => { 
			done();
		});
	});

	afterEach(() => {
		request.get.restore();
		request.post.restore();
		request.put.restore();
        request.delete.restore();
        request.patch.restore();
    });
    
    describe('[STUBBED] /GET/books', () => {
        it('it should GET all the books', (done) => {
            this.get.yields(null, null, JSON.stringify(books.all));
            request.get(`${base}/books/`, (err, res, body) => {
                body = JSON.parse(body);
                body.should.have.property("success").eql(true);
                body.data.should.be.a('array');
                body.data.length.should.be.eql(2);            
                body.data[0].should.have.property('_id').eql(1);
                body.data[1].should.have.property('_id').eql(2);
                done();
            });
        });
    });

    describe('[STUBBED] /GET/:id book', () => {
        it('it should GET a book by the given id', (done) => {
            this.get.yields(null, null, JSON.stringify(books.single.success));
            request.get(`${base}/books/1`, (err, res, body) => {
                body = JSON.parse(body);
                body.should.have.property("success").eql(true);
                body.data.should.have.property('title').eql("TITLE1");
                body.data.should.have.property('author').eql("AUTHOR1");
                body.data.should.have.property('isbn').eql("1");
                body.data.should.have.property('publishedOn').eql(2017);
                body.data.should.have.property('numberOfPages').eql(100);
                body.data.should.have.property('_id').eql(1);
                body.data.should.have.property('createdAt');
                body.data.should.have.property('updatedAt');
                done();
            });
        });

        it('it should return No Item Found by putting the given non existant id' , (done) => {
            this.get.yields(null, null, JSON.stringify(books.single.not_found));
            request.get(`${base}/books/-1`, (err, res, body) => {
                body = JSON.parse(body);
                body.should.have.property("success").eql(false);
				body.should.have.property("message").eql("No Item Found");
                done();
            });
        });

        it('it should return unsuccessful response when getting with malformed id' , (done) => {
            this.get.yields(null, null, JSON.stringify(books.single.malformed_id));
            request.get(`${base}/books/NaN-book-id`, (err, res, body) => {
                body = JSON.parse(body);
                body.should.have.property("success").eql(false);
                body.message.should.have.property("name").eql("CastError");
                done();
            });
        });
    });

    describe('[STUBBED] /POST/books', () => {
        it('it should POST a book and return the book', (done) => {
            this.post.yields(null, null, JSON.stringify(books.single.success));
            const options = {
                body: {
                    title: "TITLE1", 
                    author: "AUTHOR1", 
                    isbn: "1", 
                    publishedOn: 2019,
                    numberOfPages: 100 
                },
                json: true,
                url: `${base}/books/`
            };
            request.post(options, (err, res, body) => {
                body = JSON.parse(body);
                body.should.have.property("success").eql(true);
                body.data.should.have.property('title').eql("TITLE1");
                body.data.should.have.property('author').eql("AUTHOR1");
                body.data.should.have.property('isbn').eql("1");
                body.data.should.have.property('publishedOn').eql(2017);
                body.data.should.have.property('numberOfPages').eql(100);
                body.data.should.have.property('_id').eql(1);
                body.data.should.have.property('createdAt');
                body.data.should.have.property('updatedAt');
                done();
            });
        });

        it('it should not POST a book without a title', (done) => {
            this.post.yields(null, null, JSON.stringify(books.single.incomplete_param));
            const options = {
                body: {
                    author: "AUTHOR1", 
                    isbn: "1", 
                    publishedOn: 2019,
                    numberOfPages: 100 
                },
                json: true,
                url: `${base}/books/`
            };
            request.post(options, (err, res, body) => {
                body = JSON.parse(body);
                body.should.have.property("success").eql(false);
                body.message.errors.title.should.have.property('kind').eql('required');
                done();
            });
        });
    });

    describe('[STUBBED] /DELETE/books/:id book', () => {
        it('it should DELETE a book given the id', (done) => {
            this.delete.yields(null, null, JSON.stringify(books.single.success));
            request.delete(`${base}/books/1`, (err, res, body) => {
                body = JSON.parse(body);
                body.should.have.property("success").eql(true);
                body.data.should.have.property('title').eql("TITLE1");
                body.data.should.have.property('author').eql("AUTHOR1");
                body.data.should.have.property('isbn').eql("1");
                body.data.should.have.property('publishedOn').eql(2017);
                body.data.should.have.property('numberOfPages').eql(100);
                body.data.should.have.property('_id').eql(1);
                body.data.should.have.property('createdAt');
                body.data.should.have.property('updatedAt');
                done();
            });
        });

        it('it should receive that no data deleted by deleting the given non existant id' , (done) => {
            this.delete.yields(null, null, JSON.stringify(books.single.not_found));
            request.delete(`${base}/books/-1`, (err, res, body) => {
                body = JSON.parse(body);
                body.should.have.property("success").eql(false);
				body.should.have.property("message").eql("No Item Found");
                done();
            });
        });

        it('it should return unsuccessful response when getting with malformed id' , (done) => {
            this.delete.yields(null, null, JSON.stringify(books.single.malformed_id));
            request.delete(`${base}/books/NaN-book-id`, (err, res, body) => {
                body = JSON.parse(body);
                body.should.have.property("success").eql(false);
                body.message.should.have.property("name").eql("CastError");
                done();
            });
        });
    });

    describe('[STUBBED] /PUT/books/:id book', () => {
        it('it should PUT a book by the given id and return the book', (done) => {
            this.put.yields(null, null, JSON.stringify(books.single.update));
            const options = {
                body: {
                    title: "NEW_TITLE",
                    author: "AUTHOR1", 
                    isbn: "1", 
                    publishedOn: 2019,
                    numberOfPages: 100 
                },
                json: true,
                url: `${base}/books/`
            };
            request.put(options, (err, res, body) => {
                body = JSON.parse(body);
                body.should.have.property("success").eql(true);
                body.data.should.have.property('title').eql("NEW_TITLE");
                body.data.should.have.property('author').eql("AUTHOR1");
                body.data.should.have.property('isbn').eql("1");
                body.data.should.have.property('publishedOn').eql(2017);
                body.data.should.have.property('numberOfPages').eql(100);
                body.data.should.have.property('_id').eql(1);
                body.data.should.have.property('createdAt');
                body.data.should.have.property('updatedAt');
                done();
            });
        });

        it('it should PUT a book with previous title if no title given', (done) => {
            this.put.yields(null, null, JSON.stringify(books.single.success));
            const options = {
                body: {
                    author: "AUTHOR1", 
                    isbn: "1", 
                    publishedOn: 2019,
                    numberOfPages: 100 
                },
                json: true,
                url: `${base}/books/`
            };
            request.put(options, (err, res, body) => {
                body = JSON.parse(body);
                body.should.have.property("success").eql(true);
                body.data.should.have.property('title').eql("TITLE1");
                body.data.should.have.property('author').eql("AUTHOR1");
                body.data.should.have.property('isbn').eql("1");
                body.data.should.have.property('publishedOn').eql(2017);
                body.data.should.have.property('numberOfPages').eql(100);
                body.data.should.have.property('_id').eql(1);
                body.data.should.have.property('createdAt');
                body.data.should.have.property('updatedAt');
                done();
            });
        });

        it('it should return unsuccessful response when getting with malformed id' , (done) => {
            this.put.yields(null, null, JSON.stringify(books.single.malformed_id));
            request.put(`${base}/books/NaN-book-id`, (err, res, body) => {
                body = JSON.parse(body);
                body.should.have.property("success").eql(false);
                body.message.should.have.property("name").eql("CastError");
                done();
            });
        });
    });
});