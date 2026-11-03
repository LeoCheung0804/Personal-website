const { defineConfig } = require('playwright/test');

module.exports = defineConfig({
  testDir: './tests/browser',
  forbidOnly: !!process.env.CI,
  workers: 1,
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:8766',
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
    timezoneId: 'America/Los_Angeles',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  }
});
