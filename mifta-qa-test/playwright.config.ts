import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import { defineBddConfig } from 'playwright-bdd';

dotenv.config({ quiet: true });

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['support/fixtures.ts', 'step-definitions/**/*.ts'],
});

export default defineConfig({
  testDir,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',
    trace: 'on',
    screenshot: 'only-on-failure',
    launchOptions: { slowMo: Number(process.env.SLOWMO) || 0 },
  },
});
