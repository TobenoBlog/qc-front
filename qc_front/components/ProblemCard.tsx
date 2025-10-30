"use client";
import { useState } from "react";
import { postGrade, postProgress } from "@/lib/api";

type Props = {
  id: string;
  title: string;
  onGraded: (correct: boolean, feedback: string) => void;
};

export default function ProblemCard({ id, title, onGraded }: Props) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  async function handleSubmit() {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const res = await postGrade({ questionId: id, answer });
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
    </div>
  );
}
