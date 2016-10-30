require 'rspec'
require 'selenium-webdriver'

require_relative '../browserstack.rb'
BrowserStack.for "rspec"

RSpec.configure do |config|
  config.around(:example) do |example|
    @driver = Selenium::WebDriver.for :firefox
    begin
      example.run
    ensure 
      @driver.quit
    end
  end
end
