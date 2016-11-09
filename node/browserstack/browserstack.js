var nightwatchPatch = require('./framework_patches/nightwatchPatch.js').nightwatchPatch;
var defaultPatch = require('./framework_patches/defaultPatch.js').defaultPatch;
var trackEnvironment = require('./ci_environment.js').trackEnvironment;
var browserstackLocal = require('browserstack-local');

var BrowserStackPatch = function() {
  var bstackIdentifier = 'bstack_patches_' + (Math.random().toString(36)+'00000000000000000').slice(2, 18),
    bstackLocal;

  var beforeAll = function(callback) {
    console.log('beforeAll');
    bstackLocal = new browserstackLocal.Local();
    bstackLocal.start({
      key: process.env.BROWSERSTACK_ACCESS_KEY,
      localIdentifier: bstackIdentifier
    }, function() {
      callback();
    });
  };
  var afterAll = function(callback) {
    console.log('afterAll');
    if(bstackLocal) {
      bstackLocal.stop(function() {
        callback();
      });
    }
  };

  return {
    patch: function(frameworkPatch) {
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
        if(process.env.BSTACK_LOCAL && process.env.BSTACK_LOCAL.toLowerCase() == 'true') {
          frameworkPatch.addCapability('browserstack.local', true);
          frameworkPatch.addCapability('browserstack.localIdentifier', bstackIdentifier);
        }
        trackEnvironment(frameworkPatch.addCapability);
        frameworkPatch.patch(beforeAll, afterAll);
      }
    }
  };
}

exports.Node = function(config) {
  (new BrowserStackPatch()).patch(new defaultPatch(config));
};
exports.Protractor = function() {
  // var protractor = require('protractor');

  // exports.Node('protractor');
};
exports.Nightwatch = function(config) {
  (new BrowserStackPatch()).patch(new nightwatchPatch(config));
;
