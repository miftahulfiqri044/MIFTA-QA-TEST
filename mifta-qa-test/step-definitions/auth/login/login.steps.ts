import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from '../../../support/world';

Given('pengguna berada di halaman login', async function (this: CustomWorld) {
  await this.loginPage.open();
});

When(
  'pengguna login dengan username {string} dan password {string}',
  async function (this: CustomWorld, username: string, password: string) {
    await this.loginPage.login(username, password);
  },
);

Then('pengguna diarahkan ke halaman produk', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/\/inventory\.html$/);
});

Then('muncul pesan error {string}', async function (this: CustomWorld, message: string) {
  await expect(this.loginPage.errorMessage).toContainText(message);
});

Then('pengguna tetap berada di halaman login', async function (this: CustomWorld) {
  await expect(this.loginPage.signInButton).toBeVisible();
});
