import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.8"],
  // Static assets in /public are content-hashed by filename convention here,
  // but browsers still revalidate them by default. Since project media only
  // changes on a redeploy (new filename or a manual purge), let clients and
  // CDNs cache these long-term instead of refetching on every visit.
  async headers() {
    return [
      {
        source: "/video/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*(png|jpg|jpeg|webp|avif|svg)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
