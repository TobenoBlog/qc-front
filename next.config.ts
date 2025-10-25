import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ 開発時の警告検出を有効に
  reactStrictMode: true,

  // ✅ 環境変数設定（Vercel の Environment Variables と連携）
  // NEXT_PUBLIC_QC_API_BASE は必ず Vercel で設定：
  // 例: https://qc-api.onrender.com
  env: {
    NEXT_PUBLIC_QC_API_BASE: process.env.NEXT_PUBLIC_QC_API_BASE,
  },

  // ✅ WordPress からの iframe 埋め込み許可
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // WordPress（https://tobenicelife.com）からの埋め込みを許可
          { key: "X-Frame-Options", value: "ALLOW-FROM https://tobenicelife.com" },

          // 一部ブラウザでは上記が無視されるため、CSPも併用
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://tobenicelife.com;",
          },

          // デバッグ用：CORSを明示（APIコールは fetch 側でもAuthorization付きでOK）
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
};

export default nextConfig;
