import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { createMDX } from 'fumadocs-mdx/next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['@odyssey/ui'],
  allowedDevOrigins: ['192.168.1.19'],
  images: {
    remotePatterns: [
      new URL('https://cdn.discordapp.com/**'),
      new URL('https://images.pexels.com/photos/**'),
    ],
  },
};
const withMDX = createMDX();
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(withMDX(nextConfig));
