import { test, expect } from '@playwright/test';

// The "test that lies": one admin user, empty database.
// Passes with flying colors. Says nothing about what happens when the
// dashboard renders 500 records, respects tenant boundaries, or hides
// admin controls from viewers.

test('dashboard loads for authenticated user', async ({ page, request }) => {
  // Seed: one user, empty database
  await request.post('/api/test/seed', {
    data: {
      users: [{ email: 'test@test.com', role: 'admin', password: 'password123' }],
    },
  });

  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'test@test.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="submit"]');

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator('[data-testid="welcome"]')).toBeVisible();
});
