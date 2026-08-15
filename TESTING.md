# Testing

## Test Framework

- **Vitest** for unit and integration tests
- Test environment: Node.js
- Config: `vitest.config.ts`

## Running Tests

```bash
pnpm test          # Run all tests
pnpm vitest run    # Same as above
```

## Test Structure

Tests are located in `lib/__tests__/`:

| Test File | What It Tests |
|-----------|---------------|
| `prayer-engine.test.ts` | Prayer time calculation, formatting, Qibla direction |
| `qibla.test.ts` | Qibla bearing calculations |
| `hijri-date.test.ts` | Gregorian-to-Hijri date conversion |
| `hijri-holidays.test.ts` | Islamic holiday detection |
| `notifications.test.ts` | Notification scheduling helpers |

## What Is Tested

- **Pure functions:** Date conversion, prayer calculations, Qibla bearing, formatting
- **Business logic:** Streak calculations, holiday detection
- **Edge cases:** Boundary dates, invalid inputs, timezone handling

## What Is Not Tested (Yet)

- React components (requires jsdom environment)
- Custom hooks (requires React Testing Library)
- Database operations (requires Dexie test setup)
- E2E flows (requires Playwright/Cypress)
- PWA behavior (requires service worker testing)

## Quality Gate

Before any commit, all four checks must pass:

```bash
pnpm lint && pnpm tsc --noEmit && pnpm test && pnpm build
```

## Adding Tests

1. Create test file in `lib/__tests__/`
2. Import the function(s) to test
3. Write descriptive `describe`/`it` blocks
4. Run `pnpm test` to verify
5. Run full quality gate before committing

## Test Conventions

- One test file per module
- Descriptive test names: `it('returns correct time for noon')`
- Edge cases: empty inputs, boundary values, error conditions
- No mocking of pure functions
