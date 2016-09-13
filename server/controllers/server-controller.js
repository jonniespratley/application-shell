'use strict';

const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
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
      foo: function () { return 'FOO!'; },
      bar: function () { return 'BAR!'; },
      debug: function (optionalValue) {
        console.log("Current Context");
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


  // Set up the use of handle bars and set the path for views and layouts
  expressApp.set('views', path.join(__dirname, '/../views'));
  expressApp.engine('handlebars', handleBarsInstance.engine);
  expressApp.set('view engine', 'handlebars');
  //expressApp.enable('view cache');

  // Define static assets path - i.e. styles, scripts etc.
  expressApp.use('/', express.static( path.resolve(__dirname, '../../dist/')));
  expressApp.use('/bower_components', express.static(path.resolve(__dirname, '../../bower_components/')));
  expressApp.use(bodyParser.urlencoded({
  	extended: true
  }));
  expressApp.use(bodyParser.json());
  expressApp.use(methodOverride());
  expressApp.use(logErrors);
  expressApp.use(clientErrorHandler);
  expressApp.use(errorHandler);


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
ServerController.prototype.startServer = function (port) {
  // As a failsafe use port 0 if the input isn't defined
  // this will result in a random port being assigned
  // See : https://nodejs.org/api/http.html for details
  if (
    typeof port === 'undefined' ||
    port === null ||
    isNaN(parseInt(port, 10))
  ) {
    port = 0;
  }

  var server = this.getExpressApp().listen(port, () => {
    var serverPort = server.address().port;
    console.log('Server running on port ' + serverPort);
  });
  this.setExpressServer(server);
};

ServerController.prototype.addEndpoint = function (endpoint, controller) {
  console.log('addEndpoint', endpoint);
  // Add the endpoint and call the onRequest method when a request is made
  this.getExpressApp().get(endpoint, function (req, res) {
    controller.onRequest(req, res);
  });
};

module.exports = new ServerController();
