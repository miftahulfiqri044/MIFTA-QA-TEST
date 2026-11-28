import { expect } from '@playwright/test';
import { Then, When } from '../../../support/fixtures';

When('pengguna menekan tombol Checkout', async ({ cartPage }) => {
  await cartPage.checkout();
});

When(
  'pengguna melanjutkan checkout dengan first name {string}, last name {string}, dan postal code {string}',
  async ({ checkoutInformationPage }, firstName: string, lastName: string, postalCode: string) => {
    await checkoutInformationPage.fillInformation(firstName, lastName, postalCode);
    await checkoutInformationPage.continue();
  },
);

Then('pengguna tetap berada di halaman informasi checkout', async ({ page }) => {
  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
});

Then('muncul pesan error checkout {string}', async ({ checkoutInformationPage }, message: string) => {
  await expect(checkoutInformationPage.errorMessage).toContainText(message);
});
