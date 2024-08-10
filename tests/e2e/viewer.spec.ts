import { test, expect } from '@playwright/test';

test.describe('Viewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('default preview', async ({ page }) => {
    await expect(page).toHaveTitle('Maskable.app');

    await expect(
      page.getByRole('img', { name: 'Preview of maskable icon' }),
    ).toHaveAttribute('src', /demo\/spec\.svg$/);
  });

  [
    { name: 'W3C Example', file: 'spec.svg' },
    { name: 'Color Breakdown', file: 'color-breakdown.png' },
    { name: 'Insightful Energy', file: 'insightful-energy.svg' },
    { name: 'Big Island Buses', file: 'big-island-buses.png' },
    { name: 'PROXX', file: 'proxx.png' },
    { name: 'SVGOMG', file: 'svgomg.svg' },
  ].forEach(({ name, file }) => {
    test(`demo preview ${name}`, async ({ page }) => {
      await page.getByRole('list').getByRole('link', { name }).click();

      const expectedSrc = new RegExp(`demo/${file.replace('.', '\\.')}$`);

      await expect(
        page.getByRole('img', { name: 'Preview of maskable icon' }),
      ).toHaveAttribute('src', expectedSrc);
      await expect(
        page.getByRole('img', { name: 'Preview of original icon' }),
      ).toHaveAttribute('src', expectedSrc);
    });
  });

  test('show ghost image when control is checked', async ({ page }) => {
    const ghostIcon = page.getByRole('img', {
      name: 'Preview of original icon',
    });
    const ghostIconContainer = ghostIcon.locator('xpath=..');

    await expect(ghostIconContainer).toHaveCSS('opacity', '0');

    await page.getByLabel('Show ghost image').check();

    await expect(ghostIconContainer).not.toHaveCSS('opacity', '0');
    await expect(ghostIconContainer).toHaveCSS('opacity', '0.4');
  });
});
