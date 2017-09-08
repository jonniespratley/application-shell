'use strict';

const path = require('path');
const fs = require('fs');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const http2 = require('spdy');
const logger = require('morgan');

const log = require('npmlog');
log.heading = 'app-shell';


var sess = {
	secret: 'app-shell',
	resave: false,
	saveUninitialized: true,
	cookie: {}
};

var options = {
	key: fs.readFileSync(path.resolve(__dirname, '../../sslcerts/server.key')),
	cert: fs.readFileSync(path.resolve(__dirname, '../../sslcerts/server.crt'))
};

function errorHandler(err, req, res, next) {
	res.status(500);
	res.render('error', {error: err});
}

function clientErrorHandler(err, req, res, next) {
	if (req.xhr) {
		res.status(500).send({error: 'Something failed!'});
	} else {
		next(err);
	}
}

function logErrors(err, req, res, next) {
	console.error(err.stack);
	next(err);
}

function ServerController() {
	var expressApp = express();
	var handleBarsInstance = exphbs.create({
		defaultLayout: 'default',
		layoutsDir: path.join(__dirname, '/../views/layouts'),
		partialsDir: path.join(__dirname, '/../views/partials'),
		helpers: {
			foo: function() {
				return 'FOO!';
			},
			bar: function() {
				return 'BAR!';
			},
			debug: function(optionalValue) {
				console.log("\n\nCurrent Context");
				console.log("====================");
				console.log(this);

				if (optionalValue) {
					console.log("Value");
					console.log("====================");
					console.log(optionalValue);
				}
			}
		}
	});

	if (expressApp.get('env') === 'production') {
		expressApp.set('trust proxy', 1); // trust first proxy
		sess.cookie.secure = true; // serve secure cookies
	}

	expressApp.use(session(sess));
	expressApp.use(logger('dev'));

	// Set up the use of handle bars and set the path for views and layouts
	expressApp.set('views', path.join(__dirname, '/../views'));
	expressApp.engine('handlebars', handleBarsInstance.engine);
	expressApp.set('view engine', 'handlebars');
	//expressApp.enable('view cache');

	// Define static assets path - i.e. styles, scripts etc.
	expressApp.use('/', express.static(path.resolve(__dirname, '../../dist/')));
	expressApp.use('/bower_components', express.static(path.resolve(__dirname, '../../bower_components/')));
	expressApp.use(bodyParser.urlencoded({extended: true}));

	expressApp.use(bodyParser.json());
	expressApp.use(methodOverride());
	expressApp.use(logErrors);
	expressApp.use(clientErrorHandler);
	expressApp.use(errorHandler);

	expressApp.use((req, res, next) => {
		log.info(req.method, req.url, req.data);
		next();
	});

	expressApp.get('/pushy', (req, res) => {
		var stream = res.push('/main.js', {
			status: 200,
			method: 'GET',
			request: {
				accept: '*/*'
			},
			response: {
				'content-type': 'application/javascript'
			}
		});
		stream.on('error', function() {});
		stream.end('alert("hello from push stream!");');
		res.end('<script src="/main.js"></script>');
	});

	var expressServer = null;

	this.getExpressApp = () => {
		return expressApp;
	};

	this.setExpressServer = (server) => {
		expressServer = server;
	};

	this.getExpressServer = () => {
		return expressServer;
	};

	this.getHandleBarsInstance = () => {
		return handleBarsInstance;
	};
}

/**
 * Start the server and set the expressServer to the instance.
 * @param {Number} port The port to use
 */
ServerController.prototype.startServer = function(port, push){
	// As a failsafe use port 0 if the input isn't defined
	// this will result in a random port being assigned
	// See : https://nodejs.org/api/http.html for details
	if (typeof port === 'undefined' || port === null || isNaN(parseInt(port, 10))) {
		port = 0;
	}

	if (push) {
		var server = http2.createServer(options, this.getExpressApp()).listen(port, () => {
			var serverPort = server.address().port;
			log.info(`Server is listening on https://localhost:${serverPort}. You can open the URL in the browser.`)
		});
	} else {
		var server = this.getExpressApp().listen(port, () => {
			var serverPort = server.address().port;
			log.info('Server running on port ' + serverPort);
		});

	}

	this.setExpressServer(server);
};

ServerController.prototype.addEndpoint = function(endpoint, controller) {
	log.info('addEndpoint', endpoint);
	// Add the endpoint and call the onRequest method when a request is made
	this.getExpressApp().get(endpoint, (req, res) => {
		controller.onRequest(req, res);
	});
};

module.exports = new ServerController();
