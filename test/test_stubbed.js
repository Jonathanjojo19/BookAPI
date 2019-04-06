process.env.NODE_ENV = 'test';

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
	});

	afterEach(() => {
		request.get.restore();
		request.post.restore();
		request.put.restore();
		request.delete.restore();
	});

    describe('[STUBBED] /GET/:id book', () => {
        it('it should GET a book by the given id', (done) => {
            this.get.yields(null, null, JSON.stringify(books.single));
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
    });
});