import { createBdd, test as base } from 'playwright-bdd';
import { LoginPage } from '../pages/auth/login/LoginPage';
import { CartPage } from '../pages/cart/cart/CartPage';
import { CheckoutInformationPage } from '../pages/checkout/checkout-information/CheckoutInformationPage';
import { HeaderComponent } from '../pages/components/HeaderComponent';
import { SideMenuComponent } from '../pages/components/SideMenuComponent';
import { ProductDetailPage } from '../pages/inventory/product-detail/ProductDetailPage';
import { ProductListPage } from '../pages/inventory/product-list/ProductListPage';

type Fixtures = {
  header: HeaderComponent;
  sideMenu: SideMenuComponent;
  loginPage: LoginPage;
  productListPage: ProductListPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutInformationPage: CheckoutInformationPage;
};

// Fixture = pengganti World. Playwright membuat objek ini otomatis per tes,
// dan browser/context/page dikelola sendiri (tidak perlu hooks.ts).
export const test = base.extend<Fixtures>({
  header: async ({ page }, use) => use(new HeaderComponent(page)),
  sideMenu: async ({ page }, use) => use(new SideMenuComponent(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  productListPage: async ({ page }, use) => use(new ProductListPage(page)),
  productDetailPage: async ({ page }, use) => use(new ProductDetailPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutInformationPage: async ({ page }, use) => use(new CheckoutInformationPage(page)),
});

export const { Given, When, Then } = createBdd(test);
