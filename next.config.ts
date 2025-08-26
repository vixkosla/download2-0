import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      { // Add this pattern for wikimedia uploads
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      { // Add this pattern for yandex avatars
        protocol: 'https',
        hostname: 'avatars.mds.yandex.net',
        port: '',
        pathname: '/**',
      },
      { // Add this pattern for mebeloptovik.ru
        protocol: 'https',
        hostname: 'mebeloptovik.ru',
        port: '',
        pathname: '/**',
      },
      { // Add this pattern for xn--80akhhccjmaisrj.xn--p1ai
        protocol: 'https',
        hostname: 'xn--80akhhccjmaisrj.xn--p1ai',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
