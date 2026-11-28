import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  cartItem(productName: string): Locator {
    return this.cartItems.filter({ hasText: productName });
  }

  removeButton(productName: string): Locator {
    return this.cartItem(productName).getByRole('button', { name: 'Remove' });
  }

  async removeProduct(productName: string): Promise<void> {
    await this.removeButton(productName).click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
