
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    // !! WARN !!
    ignoreDuringBuilds: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // This alias ensures that the server-side build of Next.js can find the correct version of Handlebars
    // required by Genkit's dependencies, resolving the "Module not found" error.
    config.resolve.alias = {
      ...config.resolve.alias,
      'handlebars': 'handlebars/dist/cjs/handlebars.js',
    };
    return config;
  },
};

export default nextConfig;
