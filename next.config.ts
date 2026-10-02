import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lvm8znm7tg.ufs.sh',
        pathname: '/f/**',
      },
    ],
  },
};
export default nextConfig;
