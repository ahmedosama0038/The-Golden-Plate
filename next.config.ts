/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ شيلنا standalone عشان بيكسر مع middleware
  // output: 'standalone',

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/api/remote/:path*',
        destination: 'https://myrestaurant.runasp.net/api/:path*',
      },
    ];
  },

  // ❌ مهم: مفيش Turbo خالص
  // experimental: {
  //   turbo: {}
  // }
};

export default nextConfig;