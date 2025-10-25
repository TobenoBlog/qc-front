// components/PracticeFlow.tsx
"use client";

import ProblemCard from "@/components/ProblemCard";

export default function PracticeFlow() {
  return (
    <div className="p-4">
      <ProblemCard
        questionId="q-001"
        title="単回帰：a,b を用いて y = ax + b の a を求めよ"
        body="（ダミー）x,y のデータから a の最尤推定値を答えてください。"
      />
    </div>
  );
}

{grade && (
  <section className="space-y-3">
    <h2 className="font-semibold">4) 採点結果</h2>
    <div className={`p-4 border rounded ${grade.correct ? "bg-green-50" : "bg-red-50"}`}>
      <div className="font-bold text-lg flex items-center gap-2">
        {grade.correct ? "✅ 正解！" : "❌ 不正解"}
        <span className="text-sm px-2 py-0.5 border rounded bg-white">{(grade.score*100).toFixed(0)} 点</span>
      </div>
      <div className="text-sm mt-1">{grade.feedback}</div>
      {Array.isArray(grade.expected) ? (
        <div className="text-xs mt-2 opacity-80">期待値 (a, b): [{grade.expected[0]}, {grade.expected[1]}]</div>
      ) : (
        <div className="text-xs mt-2 opacity-80">期待値: {String(grade.expected)}</div>
      )}
    </div>
  </section>
)}

{progress && (
  <section className="space-y-2">
    <h2 className="font-semibold">5) 進捗</h2>
    <div className="p-4 border rounded bg-blue-50 space-y-2">
      <div className="font-medium">
        総問数: {progress.total} / 正答: {progress.correct} / 正答率: {(progress.accuracy*100).toFixed(1)}%
      </div>
      <div className="text-sm">
        <details>
          <summary className="cursor-pointer">タイプ別</summary>
          <ul className="list-disc ml-5 mt-2">
            {Object.entries(progress.by_type).map(([k, v]) => (
              <li key={k}>{k}: {v.correct}/{v.total}</li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  </section>
)}
