require 'selenium/webdriver'
require 'net/http'
require 'json'

require 'browserstack-patch'
BrowserStack.for "cucumber"

browser = Selenium::WebDriver.for :firefox

Before do |scenario|
  @browser = browser
end

at_exit do
  sess_id = browser.session_id
  browser.quit

  url = URI("https://www.browserstack.com/automate/sessions/#{sess_id}.json")
  Net::HTTP.start(url.host, url.port, :use_ssl => url.scheme == 'https') do |http|
    request = Net::HTTP::Get.new url.request_uri
    request.basic_auth ENV['BROWSERSTACK_USERNAME'], ENV['BROWSERSTACK_ACCESS_KEY']
    response = http.request request
    puts "Session status was not 'done'" && Kernel.exit!(1) if not JSON.parse(response.body)["automation_session"]["status"].match(/done/)
  end
end
