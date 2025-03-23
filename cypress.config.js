const fs = require("node:fs");

module.exports = {
  e2e: {
    baseUrl: "https://localhost",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: false,  // Enabling support file
    
    // Global timeout settings
    defaultCommandTimeout: 10000,       // Wait longer for commands
    pageLoadTimeout: 60000,            // Wait up to 60s for page loads
    requestTimeout: 15000,             // Wait longer for XHR requests
    responseTimeout: 30000,            // Wait longer for responses
    
    // Retry settings
    retries: {
      runMode: 2,                      // Retry failed tests twice in headless mode
      openMode: 0                      // Don't retry in interactive mode
    },
    
    // Browser settings
    chromeWebSecurity: false,          // Disable for HTTPS/cross-origin issues
    viewportWidth: 1280,
    viewportHeight: 800,
    
    // Wait for app to stabilize
    experimentalSessionAndOrigin: true,
    video: true,                        // Save videos for debugging failed tests
    /*
    * Deletes videos of successful tests that did not retry
    * */
    setupNodeEvents(on, config) {
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          // Do we have failures for any retry attempts?
          const failures = results.tests.some((test) =>
            test.attempts.some((attempt) => attempt.state === 'failed')
          )
          if (!failures) {
            // delete the video if the spec passed and no tests retried
            fs.unlinkSync(results.video)
          }
        }
      })
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
};
