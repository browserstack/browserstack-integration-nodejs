exports.Node = function(framework) {
  var webdriver = require('selenium-webdriver');
  for(var index in global.process.mainModule.children) {
    var module = global.process.mainModule.children[index];
    console.log(global.process);
    if(module.id && module.id.endsWith('selenium-webdriver/index.js')) {
      console.log(module.id);
      webdriver = require(module.id);
    }
  }
  if(webdriver) {
    var build = webdriver.Builder.prototype.build;
    console.log("PATCHING !!!");

    webdriver.Builder.prototype.build = function() {
      console.log('EEEEEEEEEEEEEEEEEEEE');
      if(process.env.RUN_ON_BSTACK && process.env.RUN_ON_BSTACK.toString().toLowerCase() == 'true') {
        this.capabilities_.set("browserstack.framework", framework || "node");
        this.capabilities_.set("browserstack.user", process.env.BROWSERSTACK_USER);
        this.capabilities_.set("browserstack.key", process.env.BROWSERSTACK_ACCESS_KEY);
        this.url_ = "http://hub.browserstack.com:80/wd/hub";
      }
      return build.call(this);
    }
  }
}

var nightwatchPatch = function() {
  patchOptions = {
    desiredCapabilities: {
      'browserstack.framework': 'nightwatch'
    }
  };
  return {
    addCapability: function(key, value) {
      patchOptions['desiredCapabilities'][key] = value;
    },
    seleniumHost: function(host, port) {
      patchOptions['seleniumHost'] = host;
      patchOptions['seleniumPort'] = port;
    },
    patch: function() {
      var nightwatch = require('nightwatch');
      var client = nightwatch.client;
      nightwatch.client = function(options) {
        options['desiredCapabilities'] = patchOptions['desiredCapabilities'];
        options['seleniumHost'] = patchOptions['seleniumHost'];
        options['seleniumPort'] = patchOptions['seleniumPort'];
        return client(options);
      }
    }
  }
}

var patch = function(frameworkPatch) {
  console.log(patch);
  if(process.env.RUN_ON_BSTACK && process.env.RUN_ON_BSTACK.toString().toLowerCase() == 'true') {
    patch.addCapability('browserstack.user', process.env.BROWSERSTACK_USERNAME);
    patch.addCapability('browserstack.key', process.env.BROWSERSTACK_ACCESS_KEY);
    patch.seleniumHost('hub.browserstack.com', 80);
    patch.patch();
  }
}

exports.Protractor = function() {
  var protractor = require('protractor');

  exports.Node('protractor');
}

exports.Nightwatch = function() {
  patch(new nightwatchPatch());
}
