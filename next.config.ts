/** @type {import('next').NextConfig} */
const nextConfig = {
 
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

};

export default nextConfig;