import type { Locator, Page } from '@playwright/test';

export class CheckoutInformationPage {
  readonly page: Page;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly postalCodeField: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameField = page.getByPlaceholder('First Name');
    this.lastNameField = page.getByPlaceholder('Last Name');
    this.postalCodeField = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.errorMessage = page.getByTestId('error');
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.postalCodeField.fill(postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }
}
