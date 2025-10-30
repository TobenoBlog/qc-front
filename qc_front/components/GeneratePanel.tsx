"use client";
import { useState } from "react";
import type { GenerateRequest } from "@/lib/api";

type Props = { onGenerate: (req: GenerateRequest) => void };

export default function GeneratePanel({ onGenerate }: Props) {
  const [topic, setTopic] = useState("mean");
  const [level, setLevel] = useState(1);

  return (
    <div className="qc-card p-4 space-y-4">
      <h2 className="font-semibold text-lg">1️⃣ 出題設定</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block mb-1 text-sm font-medium">カテゴリ</span>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full border border-neutral-800 rounded px-3 py-2 bg-white"
          >
            <option value="mean">平均</option>
            <option value="variance">分散</option>
            <option value="correlation">相関</option>
            <option value="regression">単回帰</option>
            <option value="pchart">p管理図</option>
          </select>
        </label>

        <label className="block">
          <span className="block mb-1 text-sm font-medium">レベル（1〜3）</span>
          <input
            type="number"
            min={1}
            max={3}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-32 border border-neutral-800 rounded px-3 py-2 bg-white"
          />
        </label>
      </div>

      <button
        onClick={() => onGenerate({ topic, level, count: 1 })}
        className="inline-flex items-center gap-2 rounded px-4 py-2 bg-black text-white hover:opacity-90"
      >
        🔄 問題を生成
      </button>
    </div>
  );
}
