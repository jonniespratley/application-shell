'use strict';

var StaticPageController = require('../server/controllers/static-page-controller');

var APIController = require('../server/controllers/api-controller');
var AuthController = require('../server/controllers/auth-controller');


module.exports = function(port){
	port = port || process.env.PORT;
	var serverController = require('../server/controllers/server-controller');

	// APIController serves up the HTML without any HTML body or head
	serverController.addEndpoint('/api*', new APIController(
	  serverController.getHandleBarsInstance()
	));
	serverController.addEndpoint('/oauth*', new AuthController(
	  serverController.getHandleBarsInstance()
	));
	// The static page controller serves the basic form of the pages
	serverController.addEndpoint('/*', new StaticPageController());
	serverController.startServer(port);

	return serverController;
}
