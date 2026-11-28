import { expect } from '@playwright/test';
import { Then, When } from '../../../support/fixtures';

When('pengguna mengurutkan produk dengan opsi {string}', async ({ productListPage }, option: string) => {
  await productListPage.sortBy(option);
});

Then('produk terurut dari harga terendah', async ({ productListPage }) => {
  const prices = await productListPage.getProductPrices();
  expect(prices.length).toBeGreaterThan(0);
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
});

Then(
  'produk pertama adalah {string} dengan harga {string}',
  async ({ productListPage }, productName: string, price: string) => {
    const firstCard = productListPage.productCards.first();
    await expect(firstCard.getByTestId('inventory-item-name')).toHaveText(productName);
    await expect(firstCard.getByTestId('inventory-item-price')).toHaveText(price);
  },
);

When('pengguna menambahkan produk pertama ke keranjang', async ({ productListPage }) => {
  await productListPage.addFirstProductToCart();
});
