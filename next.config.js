/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '',
  trailingSlash: false,
  env: {
    TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
    TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET,
    TWITTER_CALLBACK_URL: process.env.TWITTER_CALLBACK_URL,
    NEXT_PUBLIC_INFURA_URL: process.env.NEXT_PUBLIC_INFURA_URL,
    MONGODB_URI: process.env.MONGODB_URI,
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    CALLBACK_URL: process.env.CALLBACK_URL,
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
    config.resolve.alias['@rscs-backend'] = path.resolve(__dirname, 'node_modules/@rscs/rscs-backend');
    return config;
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://95.217.2.184:5000/:path*',
      },
      {
        source: '/callback',
        destination: '/api/auth/callback',
      },
      {
        source: '/api/users/:username/checkMiladyOG',
        destination: '/api/users/:username/checkMiladyOG/route',
      },
      {
        source: '/api/users/:username/removeVotes',
        destination: '/api/users/:username/removeVotes/route',
      },
    ];
  },
  experimental: {
    instrumentationHook: true,
  },
}

module.exports = nextConfig
