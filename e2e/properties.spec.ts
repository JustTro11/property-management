import { test, expect } from '@playwright/test';

test.describe('Property Filtering & Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/en/properties');
    });

    test('renders property list and filters', async ({ page }) => {
        // Check Main
        await expect(page.locator('main')).toBeVisible();

        // Check H1
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

        // Check Filters
        // Updated placeholder with regex to be safe
        await expect(page.getByPlaceholder(/Search by title/i)).toBeVisible();
        // Check for Status label - Scope to label to avoid matching "Any Status" option
        await expect(page.locator('label').filter({ hasText: /Status/i })).toBeVisible();
        await expect(page.locator('select')).toBeVisible();

        // Check for at least one property card header or link
        // Cards are links, not articles
        await expect(page.locator('a[href*="/properties/"]').first()).toBeVisible({ timeout: 10000 });
    });

    test('search filters properties by title', async ({ page }) => {
        // Navigate directly with query param to test server-side filtering logic
        await page.goto('/en/properties?query=Oceanfront');


        // Expect "Oceanfront Glass Home" to be visible
        await expect(page.getByText('Oceanfront Glass Home')).toBeVisible();

        // Expect "Modern Downtown Loft" to be hidden
        const cards = page.locator('a[href*="/properties/"]');
        await expect(cards).toHaveCount(1, { timeout: 10000 });

        // Verify input is populated
        await expect(page.getByPlaceholder(/Search by title/i)).toHaveValue('Oceanfront');
    });

    test('filters by status', async ({ page }) => {
        // Navigate directly with status param
        await page.goto('/en/properties?status=rented');

        // Expect "Oceanfront Glass Home" (which is rented in mock data)
        await expect(page.getByText('Oceanfront Glass Home')).toBeVisible();

        // "Modern Downtown Loft" is available, so it should be gone
        await expect(page.getByText('Modern Downtown Loft')).toBeHidden();

        // Verify dropdown is selected
        await expect(page.locator('select')).toHaveValue('rented');
    });

    test('clear filters resets the view', async ({ page }) => {
        test.slow(); // Interaction with debounced inputs and navigation can be slow

        // Apply a filter first
        const searchInput = page.getByPlaceholder(/Search by title/i);
        await searchInput.click();
        await searchInput.pressSequentially('NonExistentPropertyBlaBla', { delay: 100 });
        await expect(searchInput).toHaveValue('NonExistentPropertyBlaBla');

        // Wait URL
        await expect(page).toHaveURL(/.*query=NonExistent/, { timeout: 10000 });

        await expect(page.getByText('No properties found')).toBeVisible();

        // Click Clear Filters
        const clearButton = page.getByRole('button', { name: /clear/i });
        await clearButton.click();

        // Wait for clear
        await expect(page.getByPlaceholder(/Search by title/i)).toHaveValue('');

        // Verify properties are back
        await expect(page.locator('a[href*="/properties/"]').first()).toBeVisible();
    });

    test('navigates to details page on click', async ({ page }) => {
        test.slow();
        // Click the first property
        const firstProperty = page.locator('a[href*="/properties/"]').first();
        const link = firstProperty;

        // Get title text to verify on next page
        const titleElement = firstProperty.getByRole('heading');
        const title = await titleElement.innerText();

        await link.click();

        // Verify URL contains /properties/
        await expect(page).toHaveURL(/.*\/properties\/.*/, { timeout: 10000 });

        // Verify Title exists on details page
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
});
