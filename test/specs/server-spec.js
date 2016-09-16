'use strict';
const assert = require('assert');
const request = require('supertest');
const App = require('../mock-app');

var app = null,
  agent;

describe('Server', () => {

  before('setup', (done) => {
    app = new App();
    agent = request.agent(app.getExpressServer());
    done();
  });

  after('teardown', (done) => {
    done();
  });

  it('/api/* - should return object with partialhtml, partialscripts, partialinlinestyles, partialremotestyles', (done) => {
    agent.get('/api')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        if (err) {
          throw err;
        }
        assert(res, 'has response');
        assert(res.body.title, 'returns title');
        assert(res.body.partialremotestyles, 'returns partialremotestyles');
        assert(res.body.partialinlinestyles, 'returns partialinlinestyles');
        assert(res.body.partialscripts, 'returns partialscripts');
        assert(res.body.partialhtml, 'returns partialhtml');
        done();
      });
  });


  it('/url-1 - should return app view', (done) => {
		agent.get('/url-1')
			.set('Accept', 'application/json')
			.expect(200, done);
  });
  it('/url-2 - should return app view', (done) => {
		agent.get('/url-2')
			.set('Accept', 'application/json')
			.expect(200, done);
  });
  it('/micro-app-1 - should return app view', (done) => {
		agent.get('/micro-app-1')
			.set('Accept', 'application/json')
			.expect(200, done);
  });
});
