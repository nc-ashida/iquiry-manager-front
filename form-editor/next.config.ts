import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // 静的リソースの配信を改善
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // 画像の最適化
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
