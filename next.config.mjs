/** @type {import('next').NextConfig} */
const nextConfig = {
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
                hostname: 'www.google.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    serverActions: {
        bodySizeLimit: '4mb',
        executionTimeout: 120,
    },
    webpack: (config, { isServer }) => {
        config.resolve.alias.handlebars = 'handlebars/dist/handlebars.min.js';
        return config;
    },
};

export default nextConfig;
