import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["gray-matter"],
  outputFileTracingIncludes: {
    "/*": ["src/content/blog/**/*.mdx"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;