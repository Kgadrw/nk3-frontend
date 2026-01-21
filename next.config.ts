import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  // Turbopack configuration
  turbopack: {
    // Set the root directory to the project root to avoid workspace root warning
    root: process.cwd(),
  },
  // Webpack configuration to ensure modules resolve from project directory
  webpack: (config) => {
    const projectRoot = process.cwd();
    config.resolve = config.resolve || {};
    config.resolve.modules = [
      path.resolve(projectRoot, 'node_modules'),
      ...(config.resolve.modules || []),
    ];
    return config;
  },
};

export default nextConfig;
