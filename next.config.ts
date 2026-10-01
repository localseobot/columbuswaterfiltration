import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // This project lives in a subdirectory; pin the workspace root so Next.js
  // doesn't infer it from a parent lockfile.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
