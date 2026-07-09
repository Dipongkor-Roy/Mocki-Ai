import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["pdf-parse", "@prisma/client", ".prisma/client"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "exsit-next.vercel.app",
      },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },
};

export default nextConfig;
