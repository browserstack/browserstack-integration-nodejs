var webdriver = require('selenium-webdriver');

exports.Node = function(framework){
  var build = webdriver.Builder.prototype.build;

  webdriver.Builder.prototype.build = function(){
    if(process.env.RUN_ON_BS){
      if(framework) this.capabilities_.set("browserstack.framework", framework);
      this.capabilities_.set("browserstack.user", process.env.BROWSERSTACK_USER);
      this.capabilities_.set("browserstack.key", process.env.BROWSERSTACK_ACCESS_KEY);
      this.url_ = "http://hub.browserstack.com:80/wd/hub";
    }
    return build.call(this);
  }
}

exports.Protractor = function(){
  var protractor = require('protractor');

  exports.Node('protractor');
}

exports.Nightwatch = function(){
  var nightwatch = require('nightwatch');

  var client = nightwatch.client;
  nightwatch.client = function(options){
    if(process.env.RUN_ON_BS){
      options["desiredCapabilities"] = {
        "browserstack.user": process.env.BROWSERSTACK_USER,
        "browserstack.key": process.env.BROWSERSTACK_ACCESS_KEY,
        "browserstack.framework": "nightwatch"
      }
      options["seleniumHost"] = "hub.browserstack.com";
      options["seleniumPort"] = 80;
    }
    return client(options);
  }

  exports.Node('nightwatch');
}
