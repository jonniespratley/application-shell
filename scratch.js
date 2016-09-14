var Vulcanize = require('vulcanize');
var hydrolysis = require('hydrolysis');

/* a Hydrolysis loader object (optional) */
///var loader = new hydrolysis.loader(...)

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
var target = 'src/elements.html'
vulcan.process(target, function (err, inlinedHtml) {
  console.log(err, inlinedHtml);
});
