import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      // Safety rewrites for texture images where casing previously mismatched
      { source: '/images/textures/IMG_6308.PNG', destination: '/images/textures/img_6308.png' },
      { source: '/images/textures/IMG_6309.PNG', destination: '/images/textures/img_6309.png' },
    ];
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
