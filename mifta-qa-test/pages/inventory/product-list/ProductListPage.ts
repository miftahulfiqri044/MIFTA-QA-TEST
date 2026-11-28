import type { Locator, Page } from '@playwright/test';

export class ProductListPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly productCards: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByTestId('title');
    this.productCards = page.getByTestId('inventory-item');
    this.sortDropdown = page.getByTestId('product-sort-container');
  }

  productCard(productName: string): Locator {
    return this.productCards.filter({ hasText: productName });
  }

  productNameLink(productName: string): Locator {
    return this.productCard(productName).getByTestId('inventory-item-name');
  }

  addToCartButton(productName: string): Locator {
    return this.productCard(productName).getByRole('button', { name: 'Add to cart' });
  }

  async sortBy(optionLabel: string): Promise<void> {
    await this.sortDropdown.selectOption({ label: optionLabel });
  }

  async openProduct(productName: string): Promise<void> {
    await this.productNameLink(productName).click();
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.addToCartButton(productName).click();
  }

  async addFirstProductToCart(): Promise<void> {
    await this.productCards.first().getByRole('button', { name: 'Add to cart' }).click();
  }

  async getProductPrices(): Promise<number[]> {
    const texts = await this.productCards.getByTestId('inventory-item-price').allTextContents();
    return texts.map((text) => Number(text.replace('$', '')));
  }
}
