/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper compilation for Vercel
  experimental: {
    esmExternals: true,
  },
  
  // Configure images for better performance
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Environment variables with fallbacks for build time
  env: {
    MONGODB_URI: process.env.MONGODB_URI || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
  },
  
  // TypeScript configuration
  typescript: {
    // Enable type checking during build
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    // Don't ignore ESLint errors during build
    ignoreDuringBuilds: false,
  },
  
  // Optimize for production builds
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Webpack configuration for better compatibility
  webpack: (config, { dev, isServer }) => {
    // Ensure proper module resolution
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    
    return config;
  },
};

module.exports = nextConfig;