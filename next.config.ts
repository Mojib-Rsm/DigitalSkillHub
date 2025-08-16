
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
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb', // Increase body size limit for video uploads if needed
    },
  },
  // Increase server action timeout to 2 minutes for video generation
  serverActions: {
    bodySizeLimit: '4mb',
  },
};

export default nextConfig;
