require 'selenium/webdriver'

require 'browserstack-patch'
BrowserStack.for "cucumber"

browser = Selenium::WebDriver.for :firefox

Before do |scenario|
  @browser = browser
end

at_exit do
  browser.quit
end
