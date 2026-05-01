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
  async redirects() {
    return [
      // Hemanta drop slug normalization (2026-05-02). The two `*-diffuser-set`
      // slugs may have been linked from social posts before the rename to the
      // canonical `hemanta-*` form; keep both URLs reachable via 308.
      {
        source: "/shop/hemanta-ispani-diffuser-set",
        destination: "/shop/hemanta-ispani",
        permanent: true,
      },
      {
        source: "/shop/hemanta-rishi-diffuser-set",
        destination: "/shop/hemanta-rishi-diffuser",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
