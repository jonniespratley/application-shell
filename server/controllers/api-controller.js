'use strict';

const path = require('path');
const pathConfigs = require('../models/path-config.js');

class APIController{
  constructor(handlebarsInstance) {
    this.handlebarsInstance = handlebarsInstance;
  }
  /**
   * Looks at the request path and renders the appropriate handlebars template
   * @param {Request} req HTTP request
   * @param {Response} res HTTP response
   */
  onRequest(req, res){
    var urlSections = req.path.split('/');
    urlSections = urlSections.filter(function (sectionString) {
      return sectionString.length > 0;
    });

    var urlPath = null;
    if (urlSections.length === 1) {
      urlPath = '/';
    } else {
      urlPath = '/' + urlSections[1];
    }

    var pathConfig = pathConfigs.getConfig(urlPath);
    if (!pathConfig) {
      res.status(404).send();
      return;
    }

    var viewPath = path.join(__dirname,'/../views', pathConfig.data.view + '.handlebars');

    this.handlebarsInstance.render(viewPath, pathConfig).then(function (renderedTemplate) {

        res.json({
          title: pathConfig.data.title,
          partialinlinestyles: pathConfig.data.inlineStyles,
          partialremotestyles: pathConfig.data.remoteStyles,
          partialscripts: pathConfig.data.remoteScripts,
          partialimports: pathConfig.data.remoteImports,
          partialhtml: renderedTemplate
        });

      })
      .catch(function (err) {
        res.status(500).send();
      });
  }
}




module.exports = APIController;
