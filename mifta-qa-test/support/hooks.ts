import { After, AfterAll, Before, BeforeAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { type Browser, chromium, firefox, selectors, webkit } from '@playwright/test';
import * as allure from 'allure-js-commons';
import dotenv from 'dotenv';
import type { CustomWorld } from './world';

dotenv.config({ quiet: true });

setDefaultTimeout(30_000);

export const BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com';
const launchers = { chromium, firefox, webkit };
const browserName = (process.env.BROWSER || 'chromium') as keyof typeof launchers;

let browser: Browser;

BeforeAll(async () => {
  selectors.setTestIdAttribute('data-test');
  browser = await launchers[browserName].launch({
    headless: process.env.HEADED !== 'true',
    slowMo: Number(process.env.SLOWMO) || 0,
  });
});

AfterAll(async () => {
  await browser.close();
});

Before(async function (this: CustomWorld) {
  this.browser = browser;
  this.context = await browser.newContext({ baseURL: BASE_URL });
  this.page = await this.context.newPage();
  this.initPages();
});

After(async function (this: CustomWorld, { result }) {
  if (result?.status === Status.FAILED) {
    await allure.attachment('Screenshot saat gagal', await this.page.screenshot(), 'image/png');
  }
  await this.context.close();
});
