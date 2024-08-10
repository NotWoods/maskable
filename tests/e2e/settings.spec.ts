import { test, expect } from '@playwright/test';

[
  { name: 'Viewer', path: '/' },
  { name: 'Editor', path: '/editor' },
].forEach(({ name, path }) => {
  test.describe(`Settings for ${name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
    });

    test.afterEach(async ({ page }) => {
      await page.evaluate(() => localStorage.clear());
    });

    test('default visible masks', async ({ page }) => {
      await expect(page.getByLabel('None')).toBeVisible();
      await expect(page.getByLabel('Minimum safe area')).toBeChecked();
      await expect(page.getByLabel('Circle')).toBeVisible();
      await expect(page.getByLabel('Rounded Rectangle')).toBeVisible();
      await expect(page.getByLabel('Square')).toBeVisible();
      await expect(page.getByLabel('Drop')).toBeVisible();
      await expect(page.getByLabel('Cylinder')).toBeVisible();
    });

    test('disable mask in settings', async ({ page }) => {
      // Open settings
      await page.getByRole('link', { name: 'More masks' }).click();
      await expect(page).toHaveTitle('Maskable.app Settings');

      // Disable masks
      await expect(page.getByLabel('Minimum safe area')).toBeDisabled();
      await expect(page.getByLabel('Square')).toBeEnabled();
      await page.getByLabel('Circle').uncheck();

      // Check that the masks are not visible
      await page.goBack();
      await expect(page.getByLabel('Minimum safe area')).toBeVisible();
      await expect(page.getByLabel('Circle')).toBeHidden();
      await expect(page.getByLabel('Square')).toBeVisible();
    });

    test('enable mask in settings', async ({ page }) => {
      // Open settings
      await page.getByRole('link', { name: 'More masks' }).click();
      await expect(page).toHaveTitle('Maskable.app Settings');

      // Disable masks
      await expect(page.getByLabel('Minimum safe area')).toBeChecked();
      await expect(page.getByLabel('Square')).toBeChecked();
      await expect(page.getByLabel('Squircle')).not.toBeChecked();
      await page.getByLabel('Squircle').check();

      // Check that the masks are not visible
      await page.goBack();
      await expect(page.getByLabel('Minimum safe area')).toBeVisible();
      await expect(page.getByLabel('Square')).toBeVisible();
      await expect(page.getByLabel('Squircle')).toBeVisible();
    });
  });
});
