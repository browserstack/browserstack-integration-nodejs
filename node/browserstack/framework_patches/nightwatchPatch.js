var path = require('path');

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

      var CliRunner = require(path.join(require.main.filename, '../../lib/runner/cli/clirunner.js'));
      var origStartSelenium = CliRunner.prototype.startSelenium;
      CliRunner.prototype.startSelenium = function(callback) {
        var self = this;
        beforeAll(function() {
          origStartSelenium.apply(self, [ callback ]);
        });
      };

      nightwatch.client = function(options) {
        Object.keys(patchOptions.desiredCapabilities).forEach(function(patchKey) {
          options.desiredCapabilities[patchKey] = patchOptions.desiredCapabilities[patchKey];
        });
        delete(patchOptions.desiredCapabilities);
        Object.keys(patchOptions).forEach(function(patchKey) {
          options[patchKey] = patchOptions[patchKey];
        });
        options.globals.before = beforeAll;
        options.globals.after = afterAll;
        return client(options);
      };
    }
  }
}
