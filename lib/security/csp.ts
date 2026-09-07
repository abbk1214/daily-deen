/**
 * Content Security Policy for Daily Deen
 * Restricts resource loading to trusted sources only.
 */

export function getCSP(): string {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-inline/eval
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://*.supabase.co",
    "connect-src 'self' https://*.supabase.co https://nominatim.openstreetmap.org https://cdn.jsdelivr.net https://api.alquran.cloud https://cdn.islamic.network",
    "media-src 'self' https://cdn.islamic.network https://server*.quran.com https://download.quran.com",
    "worker-src 'self' blob:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ]

  return directives.join('; ')
}
