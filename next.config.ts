import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  return [
    {
      source: '/api/:path*',
      destination:
        process.env.NODE_ENV === 'development'
          ? 'http://127.0.0.1:8000/api/:path*'
          : '/api/:path*',
    },
  ]
},
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
