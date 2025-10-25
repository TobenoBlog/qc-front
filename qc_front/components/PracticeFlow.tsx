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
