'use client';

import dynamic from 'next/dynamic';
console.log("BASE_URL:", process.env.NEXT_PUBLIC_API_BASE);

// PracticeFlow コンポーネントをクライアント側で読み込む
const Flow = dynamic(() => import('../../components/PracticeFlow'), { ssr: false });

export default function PracticePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Flow />
    </main>
  );
}
