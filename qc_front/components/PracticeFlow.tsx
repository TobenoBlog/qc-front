// components/PracticeFlow.tsx
"use client";

import { useState } from "react";
import GeneratePanel from "@/components/GeneratePanel";
import ProblemCard from "@/components/ProblemCard";
import { postGenerate, type GeneratedProblem, type GenerateRequest } from "@/lib/api";

export default function PracticeFlow() {
  const [problems, setProblems] = useState<GeneratedProblem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (req: GenerateRequest) => {
    setError(null);
    const res = await postGenerate(req);      // /generate を叩く
    setProblems(res.problems ?? []);
    if (!res.problems?.length) {
      setError("問題が返ってきませんでした");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <GeneratePanel onGenerate={handleGenerate} />

        {error && (
          <div className="border border-red-500 text-red-700 rounded-xl p-3">
            {error}
          </div>
        )}

        {problems.length > 0 && (
          <div className="space-y-4">
            {problems.map((p, idx) => (
              <ProblemCard
                key={p.id ?? `q-${idx}`}
                questionId={p.id ?? `q-${idx}`}
                title={p.title}
                body={p.body}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
