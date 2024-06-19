const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://stubduffy.github.io',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
