import type { NextConfig } from "next";
import fs from 'fs';
import path from 'path';

// ログディレクトリの作成
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  // プロダクションビルド時に静的エクスポートを有効化
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  distDir: process.env.NODE_ENV === 'production' ? 'dist' : '.next',
  // 動的ルートを無効化して静的エクスポートを可能にする
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
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
  // ログ設定
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // カスタムログ出力
  onDemandEntries: {
    // 開発時のログ出力
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
