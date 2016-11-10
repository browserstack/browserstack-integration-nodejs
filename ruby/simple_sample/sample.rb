require 'rubygems'
require 'selenium-webdriver'
require 'browserstack-patch'

BrowserStack.for "ruby"

@repeat = ENV['REPEAT'] || 5

# Input capabilities
driver = Selenium::WebDriver.for :firefox

begin
  driver.navigate.to "http://www.google.com"
  element = driver.find_element(:name, 'q')
  element.send_keys "BrowserStack"
  element.submit
  start = Time.now.to_i
  @repeat.times do
    puts driver.title
  end
  driver.quit
rescue
  driver.quit
end
