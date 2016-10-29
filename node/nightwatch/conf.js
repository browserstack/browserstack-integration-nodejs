require('../browserstack').Nightwatch();

nightwatch_config = {
  src_folders : [ "test" ],

  selenium : {
    "start_process" : false
  },

  test_settings: {
    default: {
      desiredCapabilities: {
        'browser': 'chrome'
      }
    }
  }
};

module.exports = nightwatch_config;
