import { expect } from '@playwright/test';
import { Given, Then, When } from '../../../support/fixtures';

Given('pengguna berada di halaman login', async ({ loginPage }) => {
  await loginPage.openLoginPage();
});

// Nama akun di .feature -> nama variabel di file .env
const akun: Record<string, { user: string; password: string }> = {
  valid: { user: 'VALID_USER', password: 'VALID_PASSWORD' },
  terkunci: { user: 'LOCKED_USER', password: 'LOCKED_PASSWORD' },
  'password salah': { user: 'WRONGPASS_USER', password: 'WRONGPASS_PASSWORD' },
};

When('pengguna login dengan akun {string}', async ({ loginPage }, namaAkun: string) => {
  const variabel = akun[namaAkun];
  if (!variabel) {
    throw new Error(`Akun "${namaAkun}" tidak dikenal. Pilihan: ${Object.keys(akun).join(', ')}`);
  }

  const username = process.env[variabel.user];
  const password = process.env[variabel.password];
  if (!username || !password) {
    throw new Error(`${variabel.user} / ${variabel.password} belum diisi di file .env`);
  }

  await loginPage.login(username, password);
});

Then('pengguna diarahkan ke halaman produk', async ({ page }) => {
  await expect(page).toHaveURL(/\/inventory\.html$/);
});

Then('muncul pesan error {string}', async ({ loginPage }, message: string) => {
  await expect(loginPage.errorMessage).toContainText(message);
});

Then('pengguna tetap berada di halaman login', async ({ loginPage }) => {
  await expect(loginPage.loginButton).toBeVisible();
});
