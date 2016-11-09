exports.nightwatchPatch = function(nightwatchConfig) {
  var patchOptions = {
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
    patch: function(beforeAll, afterAll) {
      var nightwatch = require('nightwatch');
      var client = nightwatch.client;

      // console.log(nightwatchConfig.test_settings.before = function(done) {
      //   console.log('ahsdfgbaskjhdfnb');
      //   done();
      // });
      // nightwatchConfig.before = function(browser) {
      //   beforeAll(origBefore.bind(browser));
      // };
      // nightwatchConfig.after = function(browser) {
      //   afterAll(origAfter.bind(browser));
      // };
      console.log(nightwatch.prototype);
      console.log(nightwatch.client.toString());
      nightwatch.client.prototype.setOptions = function(options) {
        console.log(options);
      };

      nightwatch.client = function(options) {
        console.log(options.globals.before.toString());
        Object.keys(patchOptions.desiredCapabilities).forEach(function(patchKey) {
          options.desiredCapabilities[patchKey] = patchOptions.desiredCapabilities[patchKey];
        });
        delete(patchOptions.desiredCapabilities);
        Object.keys(patchOptions).forEach(function(patchKey) {
          options[patchKey] = patchOptions[patchKey];
        });
        options.globals.before = function(done) {
          beforeAll(function() {
          });
        }
        options.globals.after = afterAll;
        var a = client(options);
        console.log(a);
        return a;
      };
    }
  }
};
