import { test, expect } from '@playwright/test';

test.describe('Editor Export', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor');
  });

  test('export selected size and max size', async ({ page, browserName }) => {
    // Open export dialog
    await page.getByRole('button', { name: 'Export' }).click();
    await expect(page.getByRole('dialog', { name: 'Export' })).toBeVisible();

    // Check 128x128 in addition to the default Max size
    await page.getByLabel('128x128').check();

    if (browserName !== 'webkit') {
      const downloadMaxSize = page.waitForEvent(
        'download',
        (download) => download.suggestedFilename() === 'maskable_icon.png',
      );
      const download128 = page.waitForEvent(
        'download',
        (download) => download.suggestedFilename() === 'maskable_icon_x128.png',
      );
      await page.getByRole('button', { name: 'Download' }).click();

      await downloadMaxSize;
      await download128;
    }
  });

  test('JSON preview shows manifest corresponding to selected checkboxes', async ({
    page,
  }) => {
    // Open export dialog
    await page.getByRole('button', { name: 'Export' }).click();

    const details = page.getByRole('group').filter({ hasText: 'Show JSON' });
    await expect(details).not.toHaveAttribute('open');

    // Open JSON preview
    await page.getByText('Show JSON').click();
    await expect(details).toHaveAttribute('open');

    await expect(details).toContainText(
      JSON.stringify(
        [
          {
            purpose: 'maskable',
            sizes: '1024x1024',
            src: 'maskable_icon.png',
            type: 'image/png',
          },
        ],
        undefined,
        2,
      ),
      { useInnerText: true },
    );

    // Check 128x128 and 48x48 in addition to the default Max size
    await page.getByLabel('128x128').check();
    await page.getByLabel('48x48').check();

    await expect(details).toContainText(
      JSON.stringify(
        [
          {
            purpose: 'maskable',
            sizes: '1024x1024',
            src: 'maskable_icon.png',
            type: 'image/png',
          },
          {
            purpose: 'maskable',
            sizes: '48x48',
            src: 'maskable_icon_x48.png',
            type: 'image/png',
          },
          {
            purpose: 'maskable',
            sizes: '128x128',
            src: 'maskable_icon_x128.png',
            type: 'image/png',
          },
        ],
        undefined,
        2,
      ),
      { useInnerText: true },
    );
  });

  test('x button closes dialog', async ({ page }) => {
    // Open export dialog
    await page.getByRole('button', { name: 'Export' }).click();
    await expect(page.getByRole('dialog', { name: 'Export' })).toBeVisible();

    // Close export dialog
    await page.getByRole('button', { name: 'Close export dialog' }).click();
    await expect(
      page.getByRole('dialog', { name: 'Export' }),
    ).not.toBeVisible();
  });

  test('Cancel button closes dialog', async ({ page }) => {
    // Open export dialog
    await page.getByRole('button', { name: 'Export' }).click();
    await expect(page.getByRole('dialog', { name: 'Export' })).toBeVisible();

    // Close export dialog
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(
      page.getByRole('dialog', { name: 'Export' }),
    ).not.toBeVisible();
  });
});
