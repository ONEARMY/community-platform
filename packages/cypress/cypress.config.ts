import { defineConfig } from 'cypress'

export default defineConfig({
  defaultCommandTimeout: 15000,
  watchForFileChanges: true,
  chromeWebSecurity: false,
  // "Disable video records to improve test execution as it's not worth",
  video: false,
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'coverage/out-[hash].xml',
  },
  downloadsFolder: 'src/downloads',
  fixturesFolder: 'src/fixtures',
  screenshotsFolder: 'src/screenshots',
  videosFolder: 'src/videos',
  projectId: '4s5zgo',
  viewportWidth: 1000,
  viewportHeight: 1000,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./src/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3456',
    specPattern: 'src/integration/**/*.{js,jsx,ts,tsx}',
    supportFile: 'src/support/index.ts',
  },
})
