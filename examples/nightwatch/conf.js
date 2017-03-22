require('browserstack-automate').Nightwatch();

var nightwatch_config = {
  src_folders : [ 'test' ],
  globals_path: 'globals.js',

  selenium : {
    'start_process' : false
  },

  test_settings: {
    default: {
      desiredCapabilities: {
        browserName: 'chrome'
      }
    }
  }
};

module.exports = nightwatch_config;
