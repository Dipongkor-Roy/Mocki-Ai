import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  /* config options here */
  // Multiple lockfiles exist on some machines; pin the root to this project so
  // Next.js stops inferring a parent directory.
  outputFileTracingRoot: projectRoot,
  serverExternalPackages: ["pdf-parse", "@prisma/client", ".prisma/client"],
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // Optional peer dep of node-fetch (via face-api.js) that is never
      // actually used; stub it on both the server and client builds.
      encoding: false,
      // face-api.js reaches for Node-only modules it never uses in the browser.
      ...(isServer ? {} : { fs: false }),
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "exsit-next.vercel.app",
      },
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};

export default nextConfig;
