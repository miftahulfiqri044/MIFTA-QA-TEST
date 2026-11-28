import { expect } from '@playwright/test';
import { Given, Then, When } from '../../../support/fixtures';

Given('produk {string} sudah ada di keranjang', async ({ productListPage, header }, productName: string) => {
  await productListPage.addProductToCart(productName);
  await expect(header.cartBadge).toHaveText('1');
});

When('pengguna membuka halaman keranjang', async ({ header, page }) => {
  await header.openCart();
  await expect(page).toHaveURL(/\/cart\.html$/);
});

When('pengguna menghapus produk {string} dari keranjang', async ({ cartPage }, productName: string) => {
  await cartPage.removeProduct(productName);
});

Then('keranjang menampilkan produk {string}', async ({ cartPage }, productName: string) => {
  await expect(cartPage.cartItem(productName)).toBeVisible();
});

Then('produk {string} tidak ada di keranjang', async ({ cartPage }, productName: string) => {
  await expect(cartPage.cartItem(productName)).toHaveCount(0);
});

Then('badge keranjang menampilkan angka {int}', async ({ header }, count: number) => {
  await expect(header.cartBadge).toHaveText(String(count));
});

Then('badge keranjang tidak tampil', async ({ header }) => {
  await expect(header.cartBadge).toBeHidden();
});
