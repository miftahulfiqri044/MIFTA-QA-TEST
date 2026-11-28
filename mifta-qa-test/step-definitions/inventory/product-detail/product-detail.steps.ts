import { expect } from '@playwright/test';
import { Then, When } from '../../../support/fixtures';

When('pengguna membuka detail produk {string}', async ({ productListPage }, productName: string) => {
  await productListPage.openProduct(productName);
});

Then(
  'halaman detail menampilkan judul {string} dan harga {string}',
  async ({ page, productDetailPage }, productName: string, price: string) => {
    await expect(page).toHaveURL(/\/inventory-item\.html/);
    await expect(productDetailPage.productNameText).toHaveText(productName);
    await expect(productDetailPage.productPriceText).toHaveText(price);
  },
);

Then('halaman detail menampilkan deskripsi produk', async ({ productDetailPage }) => {
  await expect(productDetailPage.productDescriptionText).not.toBeEmpty();
});

When('pengguna kembali ke daftar produk', async ({ productDetailPage }) => {
  await productDetailPage.backToProducts();
});
