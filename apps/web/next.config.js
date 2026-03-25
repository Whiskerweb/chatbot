const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: ["@chatbot/db", "@chatbot/shared", "@chatbot/ai", "@chatbot/queue"],
  serverExternalPackages: ["@prisma/client", "prisma"],
  async rewrites() {
    return [
      { source: "/_trac/script.js", destination: "https://go.helloclaudia.fr/trac.js" },
      { source: "/_trac/api/:path*", destination: "https://go.helloclaudia.fr/api/:path*" },
    ];
  },
};

module.exports = nextConfig;
