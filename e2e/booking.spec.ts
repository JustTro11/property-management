import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Go to a specific property page (using the mock ID '1' which we know works)
        await page.goto('/en/properties/1');
    });

    test('opens booking modal when Book Tour is clicked', async ({ page }) => {
        // Wait for hydration
        await page.waitForLoadState('domcontentloaded');

        // Smoke Test: Check if page loaded mock data correctly
        // Use first() to avoid strict mode issues if multiple elements (e.g. mobile/desktop) exist
        await expect(page.getByRole('heading', { name: 'Modern Downtown Loft' }).first()).toBeVisible();

        const bookButton = page.getByRole('button', { name: /Book a Tour/i }).first();
        await expect(bookButton).toBeVisible({ timeout: 10000 });
        await bookButton.click();

        const modal = page.getByRole('heading', { name: 'Book a Tour' }); // More specific targeting for modal title
        await expect(modal).toBeVisible();
    });

    test('validates required fields', async ({ page }) => {
        await page.waitForLoadState('domcontentloaded');
        await page.getByRole('button', { name: /Book a Tour/i }).click();

        // Submit empty form
        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        // Check for error messages (from react-hook-form)
        await expect(page.getByText('Name is required')).toBeVisible();
        await expect(page.getByText('Email is required')).toBeVisible();
    });

    test('handles successful submission', async ({ page }) => {
        await page.waitForLoadState('domcontentloaded');

        // Mock the API call
        await page.route('/api/send-email', async route => {
            const json = { success: true };
            await route.fulfill({ json, status: 200 });
        });

        await page.getByRole('button', { name: /Book a Tour/i }).click();

        // Fill form
        await page.getByPlaceholder('John Doe').fill('Test User');
        await page.getByPlaceholder('john@example.com').fill('test@example.com');
        await page.getByPlaceholder('(555) 000-0000').fill('1234567890');

        // Select a future date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        await page.locator('input[type="date"]').fill(dateStr);

        await page.locator('button[type="submit"]').click();

        // Expect success message
        // "Request Sent!" is the title in the success view (from en.json: successTitle)
        await expect(page.getByText('Request Sent!')).toBeVisible();
    });
});
