require 'selenium/webdriver'

module Selenium
  module WebDriver
    class << self
      alias_method :original_for, :for

      def self.for(*args)
        browser = args.shift
        opts = args.shift || {}
        opts[:url] = opts[:url] || "http://127.0.0.1:4444/wd/hub"
        opts[:desired_capabilities] = opts[:desired_capabilities] || {}
        opts[:desired_capabilities][:browserName] = browser

        if ENV["RUN_ON_BS"]
          opts[:url] = "http://#{ENV["BROWSERSTACK_USER"]}:#{ENV["BROWSERSTACK_ACCESS_KEY"]}@hub.browserstack.com/wd/hub"
          opts[:desired_capabilities]["browserstack.framework"] = BrowserStack::get_framework
        end

        original_for(:remote, opts, *args)
      end
    end
  end # WebDriver
end # Selenium

module BrowserStack
  @@framework = "ruby"

  def self.for(framework)
    @@framework = framework
  end

  def self.get_framework
    @@framework
  end
end # Browserstack
