# BrowserStack-Integration

Patches for Selenium scripts and test suites to run on BrowserStack when RUN_ON_BSTACK=true is set in environment.
Currently supports Capybara

![BrowserStack Logo](https://d98b8t1nnulk5.cloudfront.net/production/images/layout/logo-header.png?1469004780)

# NodeJS

## Setup
* Clone the repo
* Install dependencies `npm install`
* Export the environment variables for the Username and Access Key of your BrowserStack account
  
  ```
  export BROWSERSTACK_USERNAME=<browserstack-username>
  export BROWSERSTACK_ACCESS_KEY=<browserstack-access-key>
  ```

## Running the test

### Node script
- To run locally, run `npm link && cd examples/simple_sample/ && npm install && npm link browserstack-patch`
- To run on BrowserStack, run `RUN_ON_BSTACK=true node sample.js`

### Nightwatch test
- To run locally, run `npm link && cd examples/nightwatch/ && npm install && npm link browserstack-patch`
- To run on BrowserStack, run `RUN_ON_BSTACK=true ./node_modules/.bin/nightwatch -c conf.js`

## Configuring Tests

The following environment variables are supported,

```
RUN_ON_BSTACK - Boolean. To run your tests on BrowserStack
BSTACK_BROWSER - The browser to run your tests on BrowserStack
BSTACK_BROWSER_VERSION - The browser_version to run your tests on BrowserStack
BSTACK_OS - The os to run your tests on BrowserStack
BSTACK_OS_VERSION - The os_version to run your tests on BrowserStack
BSTACK_DEVICE - The device to run your tests on BrowserStack
BSTACK_LOCAL - Boolean. Whether to start/stop BrowserStackLocal for your tests

BROWSERSTACK_USERNAME - your BrowserStack username
BROWSERSTACK_ACCESS_KEY - your BrowserStack accesskey
```

## To run tests

```node
npm test
```

## To integrate to your nightwatch framework

- Add the following to `conf.js` file.

```node
require('browserstack-patch').Nightwatch();
```
