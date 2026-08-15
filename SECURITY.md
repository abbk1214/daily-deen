# Security Policy

## Architecture

Daily Deen is a client-side PWA. All data lives in IndexedDB via Dexie.js. There is no backend database, no user authentication, and no server-side data storage.

## Data Privacy

- **All data stays on-device.** No user data is transmitted to any server.
- **No analytics tracking.** No third-party analytics SDKs.
- **No telemetry.** No usage data is collected.
- **No ads.** No advertising networks.

## API Keys

- API keys for AI companion features are stored in `localStorage` (encrypted at rest by the browser).
- API keys are forwarded to the provider API route (`/api/companion`) which proxies requests.
- **Recommendation:** For production, API keys should be managed server-side via environment variables, not client-side storage.

## Input Validation

- All user inputs are validated before writing to IndexedDB.
- Import/backup data is validated against expected schema before importing.
- Feature flags have SSR guards to prevent crashes in server environments.

## XSS Protection

- React escapes all rendered content by default.
- No `dangerouslySetInnerHTML` usage.
- No user-generated HTML rendering.

## Content Security

- External content is loaded from trusted CDNs (jsdelivr, islamic.network, open-meteo.com).
- No inline scripts.
- Service worker only caches known-origin assets.

## Known Limitations

- **localStorage is not encrypted.** API keys and conversation history are stored in plaintext. For production, consider Web Crypto API encryption.
- **Feature flags are client-side.** Premium feature gating must be enforced server-side.
- **No CSRF protection.** The app has no mutating API routes that require CSRF tokens.
- **No rate limiting.** The companion API route has no rate limiting. For production, implement server-side rate limiting.

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly. Do not open a public GitHub issue.
