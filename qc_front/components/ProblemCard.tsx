"use client";
import { useState } from "react";
import { postGrade, postProgress } from "@/lib/api";
import type { GradeResult } from "@/lib/api";

type Props = {
  id: string;
  title: string;
  onGraded: (correct: boolean, feedback: string) => void;
};

export default function ProblemCard({ id, title, onGraded }: Props) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [graded, setGraded] = useState<GradeResult | null>(null); // ← ここで定義！

  async function handleSubmit() {
    if (!answer.trim() || loading) return;
    setLoading(true);
    try {
      const res = await postGrade({ questionId: id, answer });
      setGraded(res); // ← 採点結果を保存
      onGraded(res.correct, res.feedback?.message ?? "");
      await postProgress({ questionId: id, answer });
    } catch (e) {
      alert(`採点エラー: ${e}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="qc-card p-4 space-y-3">
      <h2 className="font-semibold">2️⃣ 問題</h2>

      <pre className="text-sm whitespace-pre-wrap bg-neutral-100 p-3 rounded border border-neutral-800">
        {title}
      </pre>

      <div className="space-y-2">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isComposing) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="w-full border border-neutral-800 rounded px-3 py-2 bg-white"
          placeholder="例：50.12（回帰は 0.74,-2.50）"
        />

        <button
          disabled={loading}
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 rounded px-4 py-2 bg-black text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "採点中…" : "✅ 採点する"}
        </button>
      </div>

      {/* 採点結果・解説表示 */}
      {graded && (
        <div className="space-y-3 pt-2">
          <div
            className={`p-3 rounded border ${
              graded.correct
                ? "border-green-600 bg-green-50"
                : "border-red-600 bg-red-50"
            }`}
          >
            <div className="font-bold">
              {graded.correct ? "⭕ 正解！" : "❌ 不正解"}
            </div>

            {graded.feedback?.message && (
              <div className="mt-1 text-sm">{graded.feedback.message}</div>
            )}

            {"expected" in (graded.feedback ?? {}) && (
              <div className="mt-1 text-sm">
                期待値: {(graded.feedback as any).expected}（許容±
                {(graded.feedback as any).tolerance ?? "—"}）
              </div>
            )}
          </div>

      
        </div>
      )}
    </div>
  );
}
