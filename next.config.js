const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

if (process.env.NODE_ENV === "development") {
  // Enables local access to Cloudflare bindings (via `wrangler`) when
  // running `next dev`. No-op in production builds.
  const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
}

module.exports = withPWA(nextConfig);
