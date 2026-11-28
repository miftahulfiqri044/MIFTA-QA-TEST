import { type IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from '@playwright/test';
import { CartPage } from '../pages/cart/cart/CartPage';
import { CheckoutInformationPage } from '../pages/checkout/checkout-information/CheckoutInformationPage';
import { HeaderComponent } from '../pages/components/HeaderComponent';
import { SideMenuComponent } from '../pages/components/SideMenuComponent';
import { LoginPage } from '../pages/auth/login/LoginPage';
import { ProductDetailPage } from '../pages/inventory/product-detail/ProductDetailPage';
import { ProductListPage } from '../pages/inventory/product-list/ProductListPage';

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  header!: HeaderComponent;
  sideMenu!: SideMenuComponent;
  loginPage!: LoginPage;
  productListPage!: ProductListPage;
  productDetailPage!: ProductDetailPage;
  cartPage!: CartPage;
  checkoutInformationPage!: CheckoutInformationPage;

  constructor(options: IWorldOptions) {
    super(options);
  }

  initPages(): void {
    this.header = new HeaderComponent(this.page);
    this.sideMenu = new SideMenuComponent(this.page);
    this.loginPage = new LoginPage(this.page);
    this.productListPage = new ProductListPage(this.page);
    this.productDetailPage = new ProductDetailPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.checkoutInformationPage = new CheckoutInformationPage(this.page);
  }
}

setWorldConstructor(CustomWorld);
