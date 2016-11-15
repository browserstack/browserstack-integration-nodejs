exports.trackEnvironment = function(trackCaps) {
  if(process.env.TRAVIS && process.env.TRAVIS.toLowerCase() == 'true') {
    trackCaps('ci_env', 'travis');
    trackCaps('ci_env.travis.build_id', process.env.TRAVIS_BUILD_ID);
    trackCaps('ci_env.travis.build_number', process.env.TRAVIS_BUILD_NUMBER);
    trackCaps('ci_env.travis.repo_slug', process.env.TRAVIS_REPO_SLUG);
    trackCaps('ci_env.travis.test_result', process.env.TRAVIS_TEST_RESULT);
  } else if(process.env.BUILD_TAG && process.env.BUILD_TAG.toLowerCase().indexOf('jenkins') > -1) {
    trackCaps('ci_env', 'jenkins');
    trackCaps('ci_env.jenkins.build_id', process.env.BUILD_ID);
    trackCaps('ci_env.jenkins.build_number', process.env.BUILD_NUMBER);
    trackCaps('ci_env.jenkins.job_name', process.env.JOB_NAME);
    trackCaps('ci_env.jenkins.build_tag', process.env.BUILD_TAG);
    trackCaps('ci_env.jenkins.git_url', process.env.GIT_URL);
  }
};
