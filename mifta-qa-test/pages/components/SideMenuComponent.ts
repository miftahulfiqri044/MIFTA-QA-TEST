import type { Locator, Page } from '@playwright/test';

export class SideMenuComponent {
  readonly page: Page;
  readonly menuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
  }

  menuLink(menuName: string): Locator {
    return this.page.getByRole('link', { name: menuName, exact: true });
  }

  async open(): Promise<void> {
    await this.menuButton.click();
  }

  async selectMenu(menuName: string): Promise<void> {
    await this.menuLink(menuName).click();
  }
}
