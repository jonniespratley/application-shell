'use strict';

const fs = require('fs');
const cssmin = require('cssmin');
const path = require('path');
const log = require('npmlog');

log.heading = 'app-shell';
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
    inlineStyles: getFileContents(['/styles/core.css'], true),
    remoteStyles: sharedStyles,
    remoteScripts: [
      '/scripts/static-page.js'
    ]
  },
  '/url-1': {
    view: 'url-1',
    title: 'URL 1',
    inlineStyles: getFileContents(['/styles/core.css'], true),
    remoteStyles: sharedStyles,
    remoteScripts: ['/scripts/static-page.js'],
    remoteImports: [
      '/bower_components/polymer/polymer.html',
      //'/bower_components/px-theme/px-theme.html',
      // /'/bower_components/px-theme/px-app.html',
      '/bower_components/px-card/px-card.html',
      '/bower_components/px-partials/px-partials.html',
      '/bower_components/px-layout/px-layout.html',
      '/bower_components/px-table-view/px-table-view.html'
    ]
  },
  '/url-2': {
    view: 'url-2',
    title: 'URL 2',
    inlineStyles: getFileContents(['/styles/core.css'], false),
    remoteStyles: sharedStyles,
    remoteScripts: ['/scripts/static-page.js']
  },
  '/micro-app-1': {
    view: 'micro-app-1',
    title: 'Micro App 1',
    inlineStyles: getFileContents(['/styles/core.css'], false),
    remoteStyles: sharedStyles,
    remoteScripts: ['/scripts/static-page.js'],
    remoteImports: [
      '/bower_components/polymer/polymer.html',
      '/bower_components/px-layout/px-layout.html',
      '/bower_components/px-table-view/px-table-view.html'
    ]
  },
  '/app-shell': {
    view: '',
    title: 'App Shell',
    inlineStyles: getFileContents(['/styles/core.css'], false),
    remoteStyles: sharedStyles,
    remoteScripts: ['/scripts/core.js']
  }
};

/**
 * Read file return file contents.
 * Concat inline styles for document <head>
 */
function getFileContents (files, minify) {
  var flattenedContents = '';
  var pathPrefix = '/../../dist';
  var filename = null;
  files.forEach(function(file) {
    filename = path.resolve(__dirname  + pathPrefix + file);
    log.info('getFileContents', filename);
    try {
      flattenedContents += fs.readFileSync(filename);
    } catch (e) {
      log.error('ERROR', 'could not read', filename);
    }
  });
  if(minify){
    return cssmin(flattenedContents);
  }
  return flattenedContents;
}

module.exports = {
  getConfig: function(urlPath) {
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
