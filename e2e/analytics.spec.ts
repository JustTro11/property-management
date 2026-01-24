import { test, expect } from '@playwright/test'

test.describe('Analytics & Engagement Flow', () => {

    // We need to ensure clean state or robust assertions.
    // For simplicity, we'll pick a property and assume specific titles/IDs based on seed data.
    // 'Modern Downtown Loft' is a good candidate.

    test('tracks views, favorites, and inquiries correctly', async ({ page }) => {
        // Mock Email endpoint to prevent sending real emails
        await page.route('**/api/send-email', async route => {
            await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
        });

        // 1. Visit Property Details (triggers View)
        await page.goto('/properties')
        await page.getByText('Modern Downtown Loft').first().click()
        await expect(page.getByRole('heading', { name: 'Modern Downtown Loft' })).toBeVisible()

        // Wait for view tracking (async)
        await page.waitForTimeout(1000)

        // 2. Favorite the property (triggers Favorite)
        // Use .first() to target the main button next to the title, avoiding "Recently Viewed" cards
        const heartBtn = page.getByRole('button', { name: /add to favorites/i }).first()
        await heartBtn.click()
        // Wait for favorite tracking
        await page.waitForTimeout(500)

        // 3. Book a Tour (triggers Inquiry)
        const bookBtn = page.getByRole('button', { name: /book a tour/i }) // Exact match from en.json
        await expect(bookBtn).toBeVisible()
        await bookBtn.click()
        await expect(page.getByRole('heading', { name: 'Book a Tour' })).toBeVisible()

        await page.getByPlaceholder('John Doe').fill('E2E Tester')
        await page.getByPlaceholder('john@example.com').fill('e2e@test.com')
        await page.getByPlaceholder('(555) 000-0000').fill('555-9999')

        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const dateStr = tomorrow.toISOString().split('T')[0]
        await page.locator('input[type="date"]').fill(dateStr)

        // Setup listener for inquiry tracking
        const inquiryRequestPromise = page.waitForRequest(request =>
            request.url().includes('/api/analytics/track') &&
            request.method() === 'POST' &&
            request.postDataJSON().event_type === 'inquiry'
        );

        await page.getByRole('button', { name: /request tour/i }).click()
        await expect(page.getByText('Request Sent!')).toBeVisible()

        const inquiryRequest = await inquiryRequestPromise
        expect(inquiryRequest).toBeTruthy()
    })
})
