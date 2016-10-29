# BrowserStack-Patches

Patches for Selenium scripts and test suites to run on BrowserStack when RUN_ON_BS=1 is set in environment.
Currently supports Node (Protractor, Nightwatch) and Ruby (Capybara, Rspec)

![BrowserStack Logo](https://d98b8t1nnulk5.cloudfront.net/production/images/layout/logo-header.png?1469004780)

# Node.js

## Setup
* Clone the repo
* Install dependencies `cd node && npm install`
* Export the environment variables for the Username and Access Key of your BrowserStack account
  
  ```
  export BROWSERSTACK_USERNAME=<browserstack-username> &&
  export BROWSERSTACK_ACCESS_KEY=<browserstack-access-key>
  ```

## Running the test

### Node script
- To run locally, run `node sample.js`
- To run on BrowserStack, run `RUN_ON_BS=1 node sample.js`

### Protractor test
- To run locally, run `./node_modules/protractor/bin/protractor protractor/conf.js`
- To run on BrowserStack, run `RUN_ON_BS=1 ./node_modules/protractor/bin/protractor protractor/conf.js`

### Nightwatch test
- To run locally, run `./node_modules/nightwatch/bin/nightwatch nightwatch/conf.js`
- To run on BrowserStack, run `RUN_ON_BS=1 ./node_modules/nightwatch/bin/nightwatch nightwatch/conf.js`

