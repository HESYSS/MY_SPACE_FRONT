/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "crm-08498194.s3.eu-west-1.amazonaws.com",
      "pub-38a6582090c44c708edfc4468bf587d1.r2.dev",
      "b6d1642ee4dd20be92d14ff69737f7fe.serveo.net",
      "4ffc180c94b5c9add044c621c0bf2ed9.serveo.net",
    ],
  },
  env: {
    REACT_APP_API_URL:
      process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  },
  i18n: {
    locales: ["uk", "en"], // список поддерживаемых языков
    defaultLocale: "uk", // язык по умолчанию
    localeDetection: false, // автоматически определять язык по браузеру
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
