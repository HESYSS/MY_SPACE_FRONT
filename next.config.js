/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["crm-08498194.s3.eu-west-1.amazonaws.com", 'pub-38a6582090c44c708edfc4468bf587d1.r2.dev'],
  },
  env: {
    API_URL: process.env.API_URL || "http://localhost:3000/api",
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: /node_modules/,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
