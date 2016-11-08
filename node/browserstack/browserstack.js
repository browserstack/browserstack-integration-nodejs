var nightwatchPatch = require('./framework_patches/nightwatchPatch.js').nightwatchPatch;
var defaultPatch = require('./framework_patches/defaultPatch.js').defaultPatch;
var trackEnvironment = require('./ci_environment.js').trackEnvironment;

var patch = function(frameworkPatch) {
  if(process.env.RUN_ON_BSTACK && process.env.RUN_ON_BSTACK.toString().toLowerCase() == 'true') {
    frameworkPatch.addCapability('browserstack.user', process.env.BROWSERSTACK_USERNAME);
    frameworkPatch.addCapability('browserstack.key', process.env.BROWSERSTACK_ACCESS_KEY);
    frameworkPatch.seleniumHost('hub.browserstack.com', 80);
    if(process.env.BSTACK_BUILD) {
      frameworkPatch.addCapability('build', process.env.BSTACK_BUILD);
    }
    if(process.env.BSTACK_PROJECT) {
      frameworkPatch.addCapability('project', process.env.BSTACK_PROJECT);
    }
    if(process.env.BSTACK_NAME) {
      frameworkPatch.addCapability('name', process.env.BSTACK_NAME);
    }
    trackEnvironment(frameworkPatch.addCapability);
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
