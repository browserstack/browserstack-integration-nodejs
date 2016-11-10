require 'selenium/webdriver'

module Selenium
  module WebDriver
    class << self
      alias_method :original_for, :for

      def for(*args)
        browser = args.shift
        opts = args.shift || {}
        opts[:url] = opts[:url] || "http://127.0.0.1:4444/wd/hub"
        opts[:desired_capabilities] = opts[:desired_capabilities] || {}
        opts[:desired_capabilities][:browserName] = browser

        if ENV["RUN_ON_BSTACK"] && ENV["RUN_ON_BSTACK"].match(/true/i)
          opts[:url] = "http://#{ENV["BROWSERSTACK_USER"]}:#{ENV["BROWSERSTACK_ACCESS_KEY"]}@hub.browserstack.com/wd/hub"

          opts[:desired_capabilities]["browserstack.framework"] = BrowserStack::get_framework
          opts[:desired_capabilities]["build"] = ENV["BSTACK_BUILD"] if ENV["BSTACK_BUILD"]
          opts[:desired_capabilities]["project"] = ENV["BSTACK_PROJECT"] if ENV["BSTACK_PROJECT"]
          opts[:desired_capabilities]["name"] = ENV["BSTACK_NAME"] if ENV["BSTACK_NAME"]
          BrowserStack::track_environment(opts[:desired_capabilities])
        end

        original_for(:remote, opts, *args)
      end
    end
  end
end

module BrowserStack
  @@framework = "ruby"

  def self.for(framework)
    @@framework = framework
  end

  def self.get_framework
    @@framework
  end

  def self.track_environment(track_hash)
    if ENV['TRAVIS'] && ENV['TRAVIS'].match(/true/i)
      track_hash['ci_env'] = 'travis'
      track_hash['ci_env.travis.build_id'] = ENV['TRAVIS_BUILD_ID']
      track_hash['ci_env.travis.build_number'] = ENV['process.env.TRAVIS_BUILD_NUMBER']
      track_hash['ci_env.travis.repo_slug'] = ENV['process.env.TRAVIS_REPO_SLUG']
      track_hash['ci_env.travis.test_result'] = ENV['process.env.TRAVIS_TEST_RESULT']
    elsif ENV['BUILD_TAG'] && ENV['BUILD_TAG'].match(/jenkins/i)
      track_hash['ci_env'] = ENV['jenkins']
      track_hash['ci_env.jenkins.build_id'] = ENV['process.env.BUILD_ID']
      track_hash['ci_env.jenkins.build_number'] = ENV['process.env.BUILD_NUMBER']
      track_hash['ci_env.jenkins.job_name'] = ENV['process.env.JOB_NAME']
      track_hash['ci_env.jenkins.build_tag'] = ENV['process.env.BUILD_TAG']
      track_hash['ci_env.jenkins.git_url'] = ENV['process.env.GIT_URL']
    end
  end
end
