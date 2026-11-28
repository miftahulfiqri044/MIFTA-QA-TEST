import type { Locator, Page } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly productNameText: Locator;
  readonly productDescriptionText: Locator;
  readonly productPriceText: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productNameText = page.getByTestId('inventory-item-name');
    this.productDescriptionText = page.getByTestId('inventory-item-desc');
    this.productPriceText = page.getByTestId('inventory-item-price');
    this.backButton = page.getByTestId('back-to-products');
  }

  async backToProducts(): Promise<void> {
    await this.backButton.click();
  }
}
