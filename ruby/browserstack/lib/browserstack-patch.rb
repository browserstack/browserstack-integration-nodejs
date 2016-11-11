require 'selenium/webdriver'
require 'browserstack/local'

$cucumber_after = self.method(:After)

module Selenium
  module WebDriver
    class << self
      alias_method :original_for, :for

      def for(*args)
        browser = args.shift
        opts = args.shift || {}
        opts[:url] = opts[:url] || 'http://127.0.0.1:4444/wd/hub'
        opts[:desired_capabilities] = opts[:desired_capabilities] || {}
        opts[:desired_capabilities][:browserName] = browser

        if ENV['RUN_ON_BSTACK'] && ENV['RUN_ON_BSTACK'].match(/true/i)
          opts[:url] = "http://#{ENV['BROWSERSTACK_USERNAME']}:#{ENV['BROWSERSTACK_ACCESS_KEY']}@hub.browserstack.com/wd/hub"

          opts[:desired_capabilities]['browserstack.framework'] = BrowserStack::get_framework
          opts[:desired_capabilities]['browserstack.framework_version'] = BrowserStack::get_framework_version
          opts[:desired_capabilities]['build'] = ENV['BSTACK_BUILD'] if ENV['BSTACK_BUILD']
          opts[:desired_capabilities]['project'] = ENV['BSTACK_PROJECT'] if ENV['BSTACK_PROJECT']
          opts[:desired_capabilities]['name'] = ENV['BSTACK_NAME'] if ENV['BSTACK_NAME']
          if ENV['BSTACK_LOCAL'] && ENV['BSTACK_LOCAL'].match(/true/i)
            BrowserStack.start_local
            opts[:desired_capabilities]['browserstack.local'] = true
            opts[:desired_capabilities]['browserstack.localIdentifier'] = BrowserStack::get_identifier
          end
          BrowserStack::track_environment(opts[:desired_capabilities])
        end

        original_for(:remote, opts, *args)
      end
    end
  end
end

module BrowserStack
  @@framework = 'ruby'
  @@bs_local = nil
  @@bstack_identifier = 'asd'

  def self.for(framework)
    @@framework = framework
  end

  def self.get_framework
    @@framework
  end

  def self.get_framework_version
    if @@framework.match(/cucumber/i)
      return Cucumber::VERSION
    end
  end

  def self.get_identifier
    @@bstack_identifier
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

  private
  def self.start_local
    @@bs_local = BrowserStack::Local.new
    bs_local_args = {
      'key' => ENV['BROWSERSTACK_ACCESS_KEY'],
      'localIdentifier' => @@bstack_identifier
    }
    @@bs_local.start(bs_local_args)

    if @@framework.match(/cucumber/i)
      $cucumber_after.call do
        @@bs_local.stop() if @@bs_local
      end
    end
  end
end
