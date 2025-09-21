/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Optional: keep these aliases to be future-proof if any dep tries deep zod
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "zod/v3": "zod",
      "zod/v4": "zod", 
      "zod/lib": "zod",
    };
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
