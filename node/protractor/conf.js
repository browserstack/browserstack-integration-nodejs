require('../browserstack').Protractor();

exports.config = {
  'specs': [ 'google.js' ],

  'capabilities': {
    'browserName': 'firefox'
  }
};
