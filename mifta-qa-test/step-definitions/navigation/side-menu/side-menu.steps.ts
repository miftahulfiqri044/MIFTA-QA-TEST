import { expect } from '@playwright/test';
import { Then, When } from '../../../support/fixtures';

When('pengguna membuka side menu', async ({ sideMenu }) => {
  await sideMenu.open();
});

Then('menu {string} tampil di side menu', async ({ sideMenu }, menuName: string) => {
  await expect(sideMenu.menuLink(menuName)).toBeVisible();
});

When('pengguna memilih menu {string}', async ({ sideMenu }, menuName: string) => {
  await sideMenu.selectMenu(menuName);
});

Then(
  'halaman tujuan dimuat dengan alamat yang mengandung {string}',
  async ({ page }, urlPart: string) => {
    await expect(page).toHaveURL(new RegExp(urlPart.replace(/\./g, '\\.')));
  },
);
