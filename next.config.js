/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["ua", "en"],
    defaultLocale: "ua",
  },
  images: {
    domains: ["example.com"],
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
