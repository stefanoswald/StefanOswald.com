import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/acadia",
        destination: "/Acadia",
        permanent: true
      },
      {
        source: "/acadia/:path*",
        destination: "/Acadia/:path*",
        permanent: true
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/index.html"
      }
    ];
  }
};

export default nextConfig;
