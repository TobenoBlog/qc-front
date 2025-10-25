"use client";
import { useEffect, useState } from "react";

export default function Practice() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // データ取得
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const jwt = sp.get("token"); // WP側と統一
    const base =
      process.env.NEXT_PUBLIC_API_BASE || "https://qc-api.onrender.com";

    if (!jwt) {
      setError("JWT が見つかりません（WPからアクセスしてください）");
      return;
    }

    const api = base.replace(/\/+$/, ""); // 末尾スラッシュ除去

    (async () => {
      try {
        const r = await fetch(`${api}/practice?jwt=${encodeURIComponent(jwt)}`);
        if (!r.ok) throw new Error(`Error: ${r.status} ${r.statusText}`);
        const j = await r.json();
        setData(j);
      } catch (e: any) {
        setError(String(e?.message ?? e));
      }
    })();
  }, []);

  // iframe 高さ通知（WP側）
  useEffect(() => {
    const notifyHeight = () => {
      const h = Math.max(
        document.documentElement?.scrollHeight || 0,
        document.body?.scrollHeight || 0,
        800
      );
      window.parent?.postMessage({ type: "qc-embed", height: h }, "*");
    };
    notifyHeight();
    window.addEventListener("resize", notifyHeight);
    const id = window.setInterval(notifyHeight, 500); // 初期描画後の伸びにも対応
    return () => {
      window.removeEventListener("resize", notifyHeight);
      window.clearInterval(id);
    };
  }, [data, error]);

  return (
    <main className="mx-auto max-w-2xl p-4">
      <h1 className="text-xl font-bold mb-4">QC演習システム</h1>

      {error && <p className="text-red-600">Error: {error}</p>}
      {!error && !data && <p>Loading...</p>}
      {data && (
        <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap break-words">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </main>
  );
}
