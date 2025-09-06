
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverActions: {
    bodySizeLimit: '10mb',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '**',
      },
       {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // This is to fix a bug with handlebars and webpack
    config.resolve.alias.handlebars = 'handlebars/dist/handlebars.min.js';
    
    return config;
  }
};

export default nextConfig;
