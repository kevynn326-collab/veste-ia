import type { NextConfig } from "next";

// next/font self-hosts Geist/Fraunces at build time (served from our own
// origin), so no Google Fonts domains need to be allowed here.
// 'unsafe-eval' is only added in development, where React's dev mode uses
// eval() for HMR/debugging — it never uses it in production.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  // Real product images come from whatever domain each partner store/CDN
  // uses (Lomadee aggregates many retailers) — can't allowlist them one by
  // one, so any https image source is allowed.
  "img-src 'self' data: https:",
  "connect-src 'self' https://*.supabase.co",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    // Same reasoning as img-src above: partner-store images come from
    // unpredictable domains, so any https host is allowed here too.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
        ],
      },
    ];
  },
};

export default nextConfig;
