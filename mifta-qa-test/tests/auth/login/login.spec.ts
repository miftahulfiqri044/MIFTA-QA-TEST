import { expect, test } from '../../../fixtures';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('login berhasil', async ({ page, loginPage }) => {
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test('menampilkan pesan password salah', async ({ loginPage }) => {
    await loginPage.login('standard_user', 'password-salah');

    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });
});
