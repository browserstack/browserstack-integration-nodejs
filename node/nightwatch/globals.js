module.exports = { 
  before: function(done) {
    console.log('User-defined GLOBALS Before');
    done();
  },
  after: function(done) {
    console.log('User-defined GLOBALS After');
    done();
  }
};
