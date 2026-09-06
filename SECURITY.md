# Security Policy

## Architecture

Daily Deen is a Progressive Web App built with Next.js 16. Local data is stored in IndexedDB via Dexie.js. Authentication and optional cloud sync use Supabase.

## Authentication

- **Magic link authentication** via Supabase Auth.
- Sessions are managed via secure HTTP-only cookies.
- The `proxy.ts` file refreshes Supabase sessions on every request.
- Unauthenticated users can use all local features; authentication enables cloud sync.

## Data Privacy

- **Local-first architecture.** All core data lives in IndexedDB on-device.
- **Cloud sync is optional.** Users must sign in to enable sync to Supabase.
- **No analytics tracking.** No third-party analytics SDKs.
- **No telemetry.** No usage data is collected.
- **No ads.** No advertising networks.

## API Keys

- API keys are stored as server-side environment variables.
- API keys are **never** exposed to the client.

## Content Security Policy

- CSP headers configured in `lib/security/csp.ts`.
- Restrictions on script, style, image, and connect sources.
- Frame-ancestors set to `none` (no iframe embedding).

## Input Validation

- All user inputs are validated before writing to IndexedDB.
- Import/backup data is validated against expected schema before importing.
- Feature flags have SSR guards to prevent crashes in server environments.

## XSS Protection

- React escapes all rendered content by default.
- No `dangerouslySetInnerHTML` usage.
- No user-generated HTML rendering.

## Known Limitations

- **In-memory rate limiting** resets on serverless cold starts. For production, consider Redis or an external rate-limiting service.
- **localStorage is not encrypted.** For production, consider Web Crypto API encryption.
- **Feature flags are client-side.** Premium feature gating must be enforced server-side.

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly. Do not open a public GitHub issue.
