/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
    TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET,
    TWITTER_CALLBACK_URL: process.env.TWITTER_CALLBACK_URL,
    NEXT_PUBLIC_INFURA_URL: process.env.NEXT_PUBLIC_INFURA_URL,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'bson-ext': false,
        'kerberos': false,
        '@mongodb-js/zstd': false,
        'snappy': false,
        'aws4': false,
        'mongodb-client-encryption': false,
      };
    }
    const path = require('path');
    config.resolve.alias['@rscs-backend'] = path.resolve(__dirname, '../rscs-backend');
    return config;
  },
}

module.exports = nextConfig
