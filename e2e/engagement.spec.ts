import { test, expect } from '@playwright/test';

test.describe('Engagement Features', () => {

    test('updates recently viewed history', async ({ page }) => {
        // 1. Visit First Property
        await page.goto('/properties');

        // Wait for list to load
        const firstCard = page.locator('a[href*="/properties/"]').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });

        // Click first one
        await firstCard.click({ force: true });
        await page.waitForLoadState('networkidle');
        const firstTitle = await page.getByRole('heading', { level: 1 }).innerText();

        // Wait for it to be tracked
        await page.waitForTimeout(1000);

        // 2. Go back and Visit Second Property
        await page.goto('/properties');

        // Find a DIFFERENT property (by index 1)
        // Ensure there are at least 2
        const cards = page.locator('a[href*="/properties/"]');
        await expect(cards.nth(1)).toBeVisible();
        await cards.nth(1).click({ force: true });
        await page.waitForLoadState('networkidle');

        // 3. Verify Recently Viewed contains the First Property
        // Recently Viewed section usually has a heading "Recently Viewed"
        await expect(page.getByText('Recently Viewed')).toBeVisible();

        // Check if firstTitle is present in the recently viewed list
        // Limit scope to recently viewed section if possible, otherwise page search
        // RecentlyViewed usually renders PropertyCards.
        await expect(page.getByText(firstTitle).first()).toBeVisible();
    })
});
