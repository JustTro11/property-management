import { test, expect } from '@playwright/test';

test('landing page loads', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveTitle(/LuxeLiving/);
    // Updated to match a likely visible element or heading, checking main heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('navigation to properties page', async ({ page }) => {
    await page.goto('/en');

    // Use exact: true to avoid matching "Browse Properties" CTA
    await page.getByRole('link', { name: 'Properties', exact: true }).click();

    // Verify URL and content
    await expect(page).toHaveURL(/.*\/en\/properties/);
});

test('language switching', async ({ page }) => {
    await page.goto('/en');

    // Use the flag as it's always visible (name might be hidden on mobile)
    // Or target the button inside the locale switcher specifically
    const switcherButton = page.locator('button[aria-haspopup="listbox"]');
    await switcherButton.click();

    // Click Spanish option
    await page.getByRole('option', { name: 'Español' }).click();

    // Verify URL changes to /es
    await expect(page).toHaveURL(/.*\/es/);
});
