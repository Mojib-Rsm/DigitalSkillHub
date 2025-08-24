
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
  serverActions: {
    bodySizeLimit: '4mb', // Increase body size limit for image uploads
    // Increase server action timeout to 2 minutes for video generation
    executionTimeout: 120,
  },
  webpack: (config, { isServer }) => {
    // This is to fix a bug with handlebars and webpack
    config.resolve.alias.handlebars = 'handlebars/dist/handlebars.min.js';
    return config;
  }
};

export default nextConfig;
