import type { NextConfig } from "next";

const withPWA = (require('next-pwa') as (opts: Record<string, unknown>) => (config: NextConfig) => NextConfig)({
  dest: 'public',
  register: true,
  skipWaiting: true,
  clientsClaim: true,
})

const nextConfig: NextConfig = {
  output: 'export',
}

export default withPWA(nextConfig)
