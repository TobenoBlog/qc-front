"use client";
import { useState } from "react";
import GeneratePanel from "./GeneratePanel";
import ProblemCard from "./ProblemCard";
import ProgressPanel from "./ProgressPanel"; // ★ 追加
import { postGenerate } from "@/lib/api";

export default function PracticeFlow() {
  const [problem, setProblem] = useState<any>(null);
  const [result, setResult] = useState<string | null>(null);

  async function handleGenerate(req: any) {
    const res = await postGenerate(req);
    setProblem(res.problems[0]);
    setResult(null);
  }

  function handleGraded(correct: boolean, feedback: string) {
    setResult(correct ? `⭕ 正解！` : `❌ 不正解\n${feedback}`);
  }

  return (
    <div className="space-y-4">
      <GeneratePanel onGenerate={handleGenerate} />
      {problem && (
        <ProblemCard id={problem.id} title={problem.title} onGraded={handleGraded} />
      )}
      {result && (
        <div
          className={`qc-card p-4 font-medium ${
            result.startsWith("⭕") ? "bg-green-50" : "bg-red-50"
          }`}
        >
          <h2 className="font-semibold mb-2">3️⃣ 採点結果</h2>
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
      {/* ★ 常に一番下に進捗 */}
      <ProgressPanel />
    </div>
  );
}
