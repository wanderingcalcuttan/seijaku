import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rgkkylnelrqavzfwubhi.supabase.co",
        pathname: "/storage/v1/object/public/seijaku-media-prod/**",
      },
    ],
  },
};

export default nextConfig;
