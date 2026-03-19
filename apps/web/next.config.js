/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@chatbot/db", "@chatbot/shared", "@chatbot/ai", "@chatbot/queue"],
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  },
};

module.exports = nextConfig;
