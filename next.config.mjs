/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_INFURA_URL: process.env.NEXT_PUBLIC_INFURA_URL,
  },
};

export default nextConfig;
