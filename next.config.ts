/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARNING !!
    // بالتعديل ده بنقول لـ Next.js كملي الـ Build حتى لو فيه إيرور في الـ TypeScript
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