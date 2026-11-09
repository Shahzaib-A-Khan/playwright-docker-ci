import { test, expect } from '@playwright/test';

test('checkbox can be checked and unchecked', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/checkboxes');
  const first = page.getByRole('checkbox').first();
  await first.check();
  await expect(first).toBeChecked();
  await first.uncheck();
  await expect(first).not.toBeChecked();
});

test('dropdown selects an option', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dropdown');
  await page.locator('#dropdown').selectOption('Option 2');
  await expect(page.locator('#dropdown')).toHaveValue('2');
});

test('JS alert can be accepted', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Click for JS Alert' }).click();
  await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
});

test('file upload shows confirmation', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/upload');
  await page.locator('#file-upload').setInputFiles('tests/test-data/sample.txt');
  await page.locator('#file-submit').click();
  await expect(page.getByRole('heading', { name: 'File Uploaded!' })).toBeVisible();
});

test('valid login shows success message', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');
  await page.getByLabel('Username').fill('tomsmith');
  await page.getByLabel('Password').fill('SuperSecretPassword!');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
});

test('invalid login shows error message', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');
  await page.getByLabel('Username').fill('tomsmith');
  await page.getByLabel('Password').fill('wrongpassword');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('#flash')).toContainText('Your password is invalid!');
});