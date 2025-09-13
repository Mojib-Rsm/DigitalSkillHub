
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, 
  },
  eslint: {
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
  experimental: {
    allowedDevOrigins: [
      'https://firebase-studio-1755339718682.cluster-b6gwurscprhn6qxr-wtrhvkf6.cloudworkstations.dev',
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias.handlebars = 'handlebars/dist/handlebars.min.js';
    return config;
  },
};

export default nextConfig;
