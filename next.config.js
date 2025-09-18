/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure webpack is used instead of turbopack for production
  webpack: (config, { isServer }) => {
    // Add any custom webpack configuration here if needed
    return config;
  },
  
  // Configure images for better performance
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Environment variables with fallbacks
  env: {
    MONGODB_URI: process.env.MONGODB_URI || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
  },
};

module.exports = nextConfig;