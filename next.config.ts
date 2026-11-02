import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Plain static files in out/, so any static host (Netlify, Vercel, Pages) can serve the site.
  output: "export",
};

export default nextConfig;
