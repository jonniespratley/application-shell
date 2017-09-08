'use strict';
const pathConfigs = require('../models/path-config.js');

class StaticPageController {
  constructor() {}
  
    // This method looks at the request path and renders the appropriate handlebars template
  onRequest(req, res) {
    var pathConfig = pathConfigs.getConfig(req.path);
    if (!pathConfig) {
      res.status(404).send();
      return;
    }
    switch (req.path) {
      // Render with app-shell layout and include no initial content
    case '/app-shell':

      pathConfig.layout = 'app-shell';
      res.render('', pathConfig);
      return;
    default:
      res.render(pathConfig.data.view, pathConfig);
      return;
    }
  }
}


module.exports = StaticPageController;
