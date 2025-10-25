"use client";
import { useEffect, useState } from "react";

export default function Practice() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const jwt = sp.get("token"); // ← "jwt" → "token" に変更！
    const base =
      process.env.NEXT_PUBLIC_API_BASE || "https://qc-api.onrender.com";

    if (!jwt) {
      setError("JWT が見つかりません（WPからアクセスしてください）");
      return;
    }

    const api = base.replace(/\/+$/, ""); // スラッシュ重複対策

    fetch(`${api}/practice?jwt=${encodeURIComponent(jwt)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`Error: ${r.status} ${r.statusText}`);
        return r.json();
      })
      .then((j) => setData(j))
      .catch((e) => setError(String(e.message)));
  }, []);

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



  // iframe高さ調整（WordPress側へ通知）
  useEffect(() => {
    const notifyHeight = () => {
      const h =
        document.documentElement.scrollHeight ||
        document.body.scrollHeight ||
        800;
      window.parent?.postMessage({ type: "qc-embed", height: h }, "*");
    };
    notifyHeight();
    window.addEventListener("resize", notifyHeight);
    return () => window.removeEventListener("resize", notifyHeight);
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">QC演習システム</h1>
      {error && <p className="text-red-600">Error: {error}</p>}
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
