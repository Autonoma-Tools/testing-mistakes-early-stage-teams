# The Two Things Every Early-Stage Team Gets Wrong About Testing

Companion code for the Autonoma blog post [The Two Things Every Early-Stage Team Gets Wrong About Testing](https://getautonoma.com/blog/testing-mistakes-early-stage-teams).

The post identifies two compounding infrastructure failures at early-stage teams: fake test data and shared staging environments. This repo pairs the two Playwright examples (`dashboard.test.ts` in `before/` and `after/`) with the parameterized seed endpoint that makes the "after" version work. The tests are illustrative -- they require a running app with the seed endpoint -- but they are real runnable Playwright specs that typecheck and list via `npx playwright test --list`.

> Companion code for the Autonoma blog post: **[The Two Things Every Early-Stage Team Gets Wrong About Testing](https://getautonoma.com/blog/testing-mistakes-early-stage-teams)**

## Requirements

Node 20+

## Quickstart

```bash
git clone https://github.com/Autonoma-Tools/testing-mistakes-early-stage-teams.git
cd testing-mistakes-early-stage-teams
npm install
npx playwright install --with-deps chromium

# List tests (no running app needed)
npx playwright test --list

# Run tests (requires your app on http://localhost:3000)
npx playwright test before/
npx playwright test after/
```

## Project structure

```
.
├── before/
│   └── dashboard.test.ts    # The "test that lies" — one admin, empty DB
├── after/
│   └── dashboard.test.ts    # The "test that catches" — multi-tenant, 500 records
├── src/
│   └── seed-endpoint.ts     # Parameterized /api/test/seed route
├── examples/
│   └── run-tests.sh         # Quick-start script
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

- `before/` — the "test that lies": a single admin user, empty database, passes but proves nothing.
- `after/` — the "test that catches": multi-tenant data, role-based assertions, catches real bugs.
- `src/` — the parameterized seed endpoint that makes the "after" tests possible.
- `examples/` — runnable examples you can execute as-is.

## About

This repository is maintained by [Autonoma](https://getautonoma.com) as reference material for the linked blog post. Autonoma builds autonomous AI agents that plan, execute, and maintain end-to-end tests directly from your codebase.

If something here is wrong, out of date, or unclear, please [open an issue](https://github.com/Autonoma-Tools/testing-mistakes-early-stage-teams/issues/new).

## License

Released under the [MIT License](./LICENSE) © 2026 Autonoma Labs.
