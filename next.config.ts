import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Ensure JWT validation secret is available
    JWT_VALIDATION_SECRET: process.env.JWT_VALIDATION_SECRET,
    BACKEND_API_URL: process.env.BACKEND_API_URL,
  },
  experimental: {
    // Enable experimental features if needed
  },
  // Ensure environment variables are loaded
  serverRuntimeConfig: {
    JWT_VALIDATION_SECRET: process.env.JWT_VALIDATION_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  publicRuntimeConfig: {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
};

export default nextConfig;
