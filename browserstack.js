var nightwatchPatch = require('./framework_patches/nightwatchPatch.js').nightwatchPatch;
var defaultPatch = require('./framework_patches/defaultPatch.js').defaultPatch;
var trackEnvironment = require('./ci_environment.js').trackEnvironment;
var browserstackLocal = require('browserstack-local');

var BrowserStackPatch = function () {
  var bstackIdentifier = 'bstack_patches_' + (Math.random().toString(36)+'00000000000000000').slice(2, 18);
  var bstackLocal;
  var bstackUserName = process.env.BROWSERSTACK_USERNAME || process.env.BROWSERSTACK_USER;
  var bstackAccessKey = process.env.BROWSERSTACK_ACCESS_KEY || process.env.BROWSERSTACK_ACCESSKEY;

  var beforeAll = function(callback) {
    if(process.env.BSTACK_LOCAL && process.env.BSTACK_LOCAL.toLowerCase() == 'true') {
      bstackLocal = new browserstackLocal.Local();
      bstackLocal.start({
        key: bstackAccessKey,
        localIdentifier: bstackIdentifier
      }, callback);
    } else {
      callback();
    }
  };
  var afterAll = function(callback) {
    if(bstackLocal) {
      bstackLocal.stop(callback);
    } else {
      callback();
    }
  };

  return {
    patch: function(frameworkPatch) {
      require('./keep_alive_patch.js');

      if(process.env.RUN_ON_BSTACK && process.env.RUN_ON_BSTACK.toString().toLowerCase() == 'true') {
        frameworkPatch.addCapability('browserstack.user', bstackUserName);
        frameworkPatch.addCapability('browserstack.key', bstackAccessKey);
        frameworkPatch.addCapability('os', process.env.BSTACK_OS);
        frameworkPatch.addCapability('os_version', process.env.BSTACK_OS_VERSION);
        frameworkPatch.addCapability('browser_version', process.env.BSTACK_BROWSER_VERSION);
        frameworkPatch.addCapability('device', process.env.BSTACK_DEVICE);

        frameworkPatch.trackFrameworkVersion();
        frameworkPatch.seleniumHost('hub.browserstack.com', 80);

        if(process.env.BSTACK_BROWSER) {
          frameworkPatch.addCapability('browserName', process.env.BSTACK_BROWSER);
        }

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
};

exports.Node = function(config) {
  (new BrowserStackPatch()).patch(new defaultPatch(config));
};
exports.Protractor = function() {
  // var protractor = require('protractor');

  // exports.Node('protractor');
};
exports.Nightwatch = function(config) {
  (new BrowserStackPatch()).patch(new nightwatchPatch(config));
};
