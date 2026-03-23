const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: ["@chatbot/db", "@chatbot/shared", "@chatbot/ai", "@chatbot/queue"],
  serverExternalPackages: ["@prisma/client", "prisma"],
};

module.exports = nextConfig;
