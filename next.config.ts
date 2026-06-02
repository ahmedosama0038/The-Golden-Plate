/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // 👈 ضيف السطر ده هنا
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

  // 🎯 ضفنا الـ Proxy هنا عشان نلغي حوار الـ CORS نهائياً
  async rewrites() {
    return [
      {
        source: '/api/remote/:path*',
        destination: 'https://myrestaurant.runasp.net/api/:path*',
      },
    ]
  },
};

export default nextConfig;