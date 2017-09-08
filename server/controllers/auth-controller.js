'use strict';

const request = require('request');
const log = require('npmlog');
const path = require('path');
const pathConfigs = require('../models/path-config.js');



const scope = '';
const AUTH_URL = 'https://69687fd0-c926-4e4f-8563-5c88042db69c.predix-uaa.run.aws-usw02-pr.ice.predix.io';
const AUTH_CLIENT_ID = 'app-shell';
const AUTH_CLIENT_SECRET = 'secret';
const AUTH_REDIRECT = 'http://localhost:8282/oauth/callback';
const AUTH_FORWARD_URL = `${AUTH_URL}/oauth/authorize?response_type=code&client_id=${AUTH_CLIENT_ID}&scope=&redirect_uri=${AUTH_REDIRECT}`;
const CLIENT_AUTH = new Buffer(`${AUTH_CLIENT_ID}:${AUTH_CLIENT_SECRET}`).toString('base64');

const baseRequest = request.defaults({
  json: true,
  baseUrl: AUTH_URL,
  headers: {
    'Accept': 'application/json',
    'Authorization': `Basic ${CLIENT_AUTH}`
  }
});

function $http(options) {
  return new Promise(function (resolve, reject) {
    baseRequest(options, function (err, resp, body) {
      if (!err && resp.statusCode === 200) {
        resolve(body);
      } else {
        reject(err);
      }
    });
  });
}

function authorize(user) {
  return $http({
    url: '/oauth/token',
    method: 'POST',
    headers: {
      'Authorization': `Basic ${CLIENT_AUTH}`
    },
    form: {
      grant_type: 'password',
      scope: '',
      username: user.username,
      password: user.password
    }
  });
}

function getToken(code) {
  return $http({
    url: '/oauth/token',
    method: 'POST',
    form: {
      grant_type: 'authorization_code',
      client_id: AUTH_CLIENT_ID,
      client_secret: AUTH_CLIENT_SECRET,
      scope: '',
      redirect_uri: AUTH_REDIRECT,
      code: code
    }
  });
}

function checkToken(token) {
  return $http({
    url: '/check_token',
    method: 'POST',
    form: {
      token: token
    }
  });
}

class AuthController {
  constructor(handlebarsInstance) {
      this.handlebarsInstance = handlebarsInstance;
    }
    /**
     * Looks at the request path and renders the appropriate handlebars template
     * @param {Request} req HTTP request
     * @param {Response} res HTTP response
     */
  onRequest(req, res) {
    var urlPath = null;
    var urlSections = req.path.split('/');
    urlSections = urlSections.filter(function (sectionString) {
      return sectionString.length > 0;
    });


    if (urlSections.length === 1) {
      urlPath = '/';
    } else {
      urlPath = '/' + urlSections[1];
    }

    switch (urlSections[1]) {
    case 'authorize':
      res.redirect(AUTH_FORWARD_URL);
      break;

    case 'logout':
      req.session.destroy(function(err) {
        return res.status(200).send('Session destroyed');
      });
      break;
    case 'callback':
      return this.onCallback(req, res);
      break;
    default:
      return res.status(200).json({
        message: 'Please choose an action. authorize / userinfo'
      });
      break;
    }

  }

  onCallback(req, res) {

    if (req.query.error) {
      return res.status(400).json(req.query);
    }

    if (req.query.access_token) {
      return res.status(200).json(req.query);
    }

    if (req.query.code) {
      log.info('Get auth token from code', req.query.code);

      getToken(req.query.code).then((resp) => {
        log.info('getToken', resp);

        checkToken(resp.access_token).then((resp) => {
          log.info('checkToken', resp);

            console.log(req.session);
          return res.status(200).send(resp);
        }).catch((err) => {
          return res.status(400).send(err);
        });
      }).catch((err) => {
        return res.status(400).send(err);
      });
    }
  }
}




module.exports = AuthController;
