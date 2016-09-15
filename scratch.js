'use strict';
const Vulcanize = require('vulcanize');
const hydrolysis = require('hydrolysis');


var target = 'src/elements.html';

/* a Hydrolysis loader object (optional)
var loader = new hydrolysis.loader(...)
hydrolysis.Analyzer.analyze(target).then(function(analyzer) {
  console.log(analyzer)
});
*/
var vulcan = new Vulcanize({
  abspath: '',
  excludes: [
  //  '\\.css$'
  ],
  stripExcludes: [],
  inlineScripts: true,
  inlineCss: true,
  addedImports: [],
  redirects: [],
  implicitStrip: true,
  stripComments: true,
    // optional
    //loader: loader,
  inputUrl: ''
});

vulcan.process(target, function (err, inlinedHtml) {
  //console.log(err, inlinedHtml);
});
