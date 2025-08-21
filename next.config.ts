
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
  serverActions: {
    bodySizeLimit: '4mb', // Increase body size limit for image uploads
    // Increase server action timeout to 2 minutes for video generation
    executionTimeout: 120,
  },
  serverRuntimeConfig: {
    googleAppCredsJson: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
  }
};

export default nextConfig;
