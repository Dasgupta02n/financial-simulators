import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["gray-matter"],
  outputFileTracingIncludes: {
    "/*": ["src/content/blog/**/*.mdx"],
  },
};

export default nextConfig;