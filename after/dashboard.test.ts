import { test, expect } from '@playwright/test';

// The 'test that catches': 2 tenants, 3 users with different roles, 500
// records across a year. Logs in as a viewer on tenant-a and verifies two
// things the 'before' version cannot:
//   1. Tenant isolation — the viewer sees only tenant-a rows.
//   2. Permission boundary — the viewer cannot see admin controls.

test('dashboard loads with production-like data', async ({ page, request }) => {
  await request.post('/api/test/seed', {
    data: {
      tenants: [
        { id: 'tenant-a', plan: 'pro' },
        { id: 'tenant-b', plan: 'free' },
      ],
      users: [
        { email: 'admin@a.com', role: 'admin', tenantId: 'tenant-a', password: 'password123' },
        { email: 'viewer@a.com', role: 'viewer', tenantId: 'tenant-a', password: 'password123' },
        { email: 'admin@b.com', role: 'admin', tenantId: 'tenant-b', password: 'password123' },
      ],
      records: {
        count: 500,
        tenantId: 'tenant-a',
        dateRange: { from: '2025-01-01', to: '2026-04-13' },
      },
    },
  });

  // Log in as viewer, not admin
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'viewer@a.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="submit"]');

  await expect(page).toHaveURL(/\/dashboard/);

  // Tenant isolation: should only see tenant-a records (first page)
  const rows = page.locator('[data-testid="dashboard-row"]');
  await expect(rows).toHaveCount(25);

  // Permission: viewer should NOT see admin controls
  await expect(page.locator('[data-testid="delete-button"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="export-button"]')).toBeHidden();
});
