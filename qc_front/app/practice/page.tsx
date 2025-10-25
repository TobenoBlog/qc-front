'use client';

import dynamic from 'next/dynamic';

// PracticeFlow コンポーネントをクライアント側で読み込む
const Flow = dynamic(() => import('../../components/PracticeFlow'), { ssr: false });

export default function PracticePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Flow />
    </main>
  );
}

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

