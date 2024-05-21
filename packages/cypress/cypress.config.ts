import { defineConfig } from 'cypress'

import { setupNodeEvents } from './src/plugins'

export default defineConfig({
  defaultCommandTimeout: 15000,
  watchForFileChanges: true,
  chromeWebSecurity: false,
  // "Disable video records to improve test execution as it's not worth",
  video: true,
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
    setupNodeEvents: setupNodeEvents,
    baseUrl: 'http://localhost:3456',
    specPattern: 'src/integration/**/*.{js,jsx,ts,tsx}',
    supportFile: 'src/support/index.ts',
  },
})
