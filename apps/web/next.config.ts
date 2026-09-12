import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { createMDX } from 'fumadocs-mdx/next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            value: `${process.env.NEXT_PUBLIC_URL}`,
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
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
