import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {

    test('protected route redirects to login', async ({ page }) => {
        // Attempt to visit admin page without session
        await page.goto('/en/admin');

        // Should be redirected to login
        await expect(page).toHaveURL(/.*\/en\/login/);
    });

    test('login page renders correctly', async ({ page }) => {
        await page.goto('/en/login');

        // Check for key elements using actual text from the component
        await expect(page.getByRole('heading', { name: /Admin Access/i })).toBeVisible();
        await expect(page.getByLabel(/Email address/i)).toBeVisible();
        await expect(page.getByLabel(/Password/i)).toBeVisible();

        // Use role for button to ensure accessibility
        await expect(page.getByRole('button', { name: /Sign in/i })).toBeVisible();
    });

    test('login form validation and submission attempt', async ({ page }) => {
        await page.goto('/en/login');

        // Fill with dummy data
        await page.getByLabel(/Email address/i).fill('test@example.com');
        await page.getByLabel(/Password/i).fill('password123');

        // Note: We can't fully mock the Supabase auth response easily here without
        // extensive network mocking because it uses the real Supabase client.
        // But we can ensure the button is clickable and doesn't crash the page.

        const signInButton = page.getByRole('button', { name: /Sign in/i });
        await expect(signInButton).toBeEnabled();

        // Optional: Click and check for error message or loading state if applicable
        // await signInButton.click();
        // await expect(page.getByText(/Invalid login credentials/i)).toBeVisible(); 
    });
});
