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
// app/practice/page.tsx
import ProblemCard from "@/components/ProblemCard";

export default function PracticePage() {
  // 本当は /generate で得た問題リストを map する想定
  // まずは1問で動作確認
  return (
    <main className="p-4 text-black bg-white">
      <ProblemCard
        questionId="q-001"
        title="単回帰：a,b を用いて y = ax + b の a を求めよ"
        body="（ダミー）x,y のデータから a の最尤推定値を答えてください。"
      />
    </main>
  );
}
