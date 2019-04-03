//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let Book = require('../models/Book');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

//Our parent block
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
					done();
				});
		});
	});
});
  