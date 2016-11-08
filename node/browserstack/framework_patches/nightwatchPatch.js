exports.nightwatchPatch = function() {
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
};
