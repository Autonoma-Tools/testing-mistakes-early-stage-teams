import type { Express, Request, Response } from 'express';

// Parameterized seed endpoint. Disabled in production.
// Accepts `{ tenants, usersPerTenant, recordsPerUser }` and creates realistic
// state by sampling plans, roles, signup dates, and onboarding completion.
// The randomness produces the variety that fixed fixtures cannot.

type Context = {
  createTenant: (input: {
    plan: 'free' | 'pro' | 'enterprise';
  }) => Promise<{ id: string }>;
  createUser: (input: {
    tenantId: string;
    role: 'admin' | 'editor' | 'viewer';
    signupDate: Date;
    onboardingCompleted: boolean;
  }) => Promise<{ id: string }>;
  createRecords: (input: {
    userId: string;
    tenantId: string;
    count: number;
    dateRange: { from: Date; to: Date };
  }) => Promise<void>;
};

type SeedBody = {
  tenants?: number;
  usersPerTenant?: number;
  recordsPerUser?: number;
};

const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const randomFrom = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const randomBoolean = (trueProb: number) => Math.random() < trueProb;
const randomDate = (opts: { from: string; to: string }) => {
  const fromMs = new Date(opts.from).getTime();
  const toMs = new Date(opts.to).getTime();
  return new Date(fromMs + Math.random() * (toMs - fromMs));
};

export function registerSeedRoute(app: Express, ctx: Context): void {
  app.post('/api/test/seed', async (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'production') {
      return res
        .status(403)
        .json({ error: 'Seed endpoint is disabled in production' });
    }

    const {
      tenants = 2,
      usersPerTenant = 5,
      recordsPerUser = 100,
    }: SeedBody = req.body ?? {};

    for (const _t of range(tenants)) {
      const tenant = await ctx.createTenant({
        plan: randomFrom(['free', 'pro', 'enterprise'] as const),
      });

      for (const _u of range(usersPerTenant)) {
        const user = await ctx.createUser({
          tenantId: tenant.id,
          role: randomFrom(['admin', 'editor', 'viewer'] as const),
          signupDate: randomDate({ from: '2024-01-01', to: '2026-04-13' }),
          onboardingCompleted: randomBoolean(0.8),
        });

        await ctx.createRecords({
          userId: user.id,
          tenantId: tenant.id,
          count: recordsPerUser,
          dateRange: {
            from: new Date('2024-01-01'),
            to: new Date(),
          },
        });
      }
    }

    return res.json({ status: 'seeded' });
  });
}
