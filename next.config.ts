export default {
  experimental: {
    //ppr: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.gr-assets.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'images.amazon.com',
        port: '',
      },
    ],
  },
};
