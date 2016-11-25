var webdriver = require('selenium-webdriver');

require('browserstack-automate').Node();

var repeat = process.env.REPEAT || 5;

var driver = new webdriver.Builder().
  forBrowser('firefox').
  build();

driver.get('http://www.google.com');

for(var i=0; i<repeat; i++){
  driver.findElement(webdriver.By.name('q')).sendKeys('BrowserStack');
}

driver.findElement(webdriver.By.name('btnG')).click();
driver.getTitle().then(function(title) {
  console.log(title);
});

driver.quit();
