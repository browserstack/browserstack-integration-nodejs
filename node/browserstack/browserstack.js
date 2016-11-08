var nightwatchPatch = require('./nightwatchPatch.js').nightwatchPatch;
var defaultPatch = require('./defaultPatch.js').defaultPatch;

var patch = function(frameworkPatch) {
  if(process.env.RUN_ON_BSTACK && process.env.RUN_ON_BSTACK.toString().toLowerCase() == 'true') {
    frameworkPatch.addCapability('browserstack.user', process.env.BROWSERSTACK_USERNAME);
    frameworkPatch.addCapability('browserstack.key', process.env.BROWSERSTACK_ACCESS_KEY);
    frameworkPatch.seleniumHost('hub.browserstack.com', 80);
    frameworkPatch.patch();
  }
};

exports.Node = function(framework) {
  patch(new defaultPatch());
};
exports.Protractor = function() {
  var protractor = require('protractor');

  exports.Node('protractor');
};
exports.Nightwatch = function() {
  patch(new nightwatchPatch());
};
