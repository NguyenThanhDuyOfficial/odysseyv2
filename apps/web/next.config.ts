import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['@odyssey/ui'],
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
