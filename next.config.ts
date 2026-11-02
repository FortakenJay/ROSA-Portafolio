import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  cacheComponents: true,
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
