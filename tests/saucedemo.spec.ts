import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

test.describe('saucedemo', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  test('valid login shows the products page', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
  });

  test('invalid login shows an error', async () => {
    await loginPage.login('standard_user', 'wrong_password');
    await expect(loginPage.errorMessage).toContainText('do not match');
  });

  test('add item to cart updates the badge', async () => {
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addBackpack();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('remove item from cart clears the badge', async () => {
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addBackpack();
    await inventoryPage.removeBackpack();
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });

  test('cart page lists the added item', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addBackpack();
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.cartLink.click();
    await expect(page).toHaveURL(/cart/);
    const cartPage = new CartPage(page);
    await expect(cartPage.itemNames).toHaveCount(1);
    await expect(cartPage.itemNames).toHaveText('Sauce Labs Backpack');
  });

  test('logout returns to the login page', async () => {
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.logout();
    await expect(loginPage.loginButton).toBeVisible();
  });
});