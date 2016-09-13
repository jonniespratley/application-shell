var fs = require('fs');
var path = require('path');

var sharedStyles = [
  //'http://predixdev.github.io/px-layout/bower_components/px-layout/css/px-layout.css'
];

/**
 * Path configuration for each url in the app.
 */
var pathConfigs = {
  '/': {
    view: 'index',
    title: 'Index',
    inlineStyles: getFileContents(['/styles/core.css']),
    remoteStyles: sharedStyles,
    remoteScripts: [
      '/scripts/static-page.js'
    ]
  },
  '/url-1': {
    view: 'url-1',
    title: 'URL 1',
    inlineStyles: getFileContents(['/styles/core.css']),
    remoteStyles: sharedStyles,
    remoteScripts: ['/scripts/static-page.js']
  },
  '/url-2': {
    view: 'url-2',
    title: 'URL 2',
    inlineStyles: getFileContents(['/styles/core.css']),
    remoteStyles: sharedStyles,
    remoteScripts: ['/scripts/static-page.js']
  },
  '/app-shell': {
    view: '',
    title: 'App Shell',
    inlineStyles: getFileContents(['/styles/core.css']),
    remoteStyles: sharedStyles,
    remoteScripts: ['/scripts/core.js']
  }
};

function getFileContents(files) {
  // Concat inline styles for document <head>
  var flattenedContents = '';
  var pathPrefix = '/../../dist/';
  files.forEach(function (file) {
    flattenedContents += fs.readFileSync(path.resolve(__dirname) +
      pathPrefix + file);
  });

  return flattenedContents;
}

module.exports = {
  getConfig: function (urlPath) {
    var object = pathConfigs[urlPath];

    // Check if the path is actually valid.
    if (!object) {
      return null;
    }

    return {
      'data': object
    };
  }
};
