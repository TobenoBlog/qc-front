// components/GeneratePanel.tsx
"use client";

import { useEffect, useState } from "react";
import type { Topic, GenerateRequest } from "@/lib/api";

type Props = {
  defaultTopic?: Topic;
  defaultLevel?: number;
  defaultCount?: number;
  onGenerate: (req: GenerateRequest) => void | Promise<void>;
};

const TOPIC_OPTIONS: { value: Topic; label: string }[] = [
  { value: "mean", label: "平均" },
  { value: "variance", label: "分散" },
  { value: "correlation", label: "相関" },
  { value: "pchart", label: "p管理図" },
  { value: "regression", label: "単回帰" },
];

export default function GeneratePanel({
  defaultTopic = "mean",
  defaultLevel = 1,
  defaultCount = 5,
  onGenerate,
}: Props) {
  const [topic, setTopic] = useState<Topic>(defaultTopic);
  const [level, setLevel] = useState<number>(defaultLevel);
  const [count, setCount] = useState<number>(defaultCount);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 選択の保持（任意）
  useEffect(() => {
    try {
      const raw = localStorage.getItem("qc_generate_pref");
      if (raw) {
        const o = JSON.parse(raw);
        if (o.topic) setTopic(o.topic);
        if (o.level) setLevel(o.level);
        if (o.count) setCount(o.count);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("qc_generate_pref", JSON.stringify({ topic, level, count }));
    } catch {}
  }, [topic, level, count]);

  const handleClick = async () => {
    setErr(null);
    setBusy(true);
    try {
      await onGenerate({ topic, level, count });
    } catch (e: any) {
      setErr(e?.message ?? "生成に失敗しました");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border border-neutral-300 rounded-2xl p-4 bg-white">
      <h2 className="text-lg font-semibold text-black">QC演習フロー</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
        <label className="flex flex-col gap-1 text-sm text-black">
          <span>テーマ</span>
          <select
            className="border border-neutral-300 rounded-md px-3 py-2 bg-white text-black"
            value={topic}
            onChange={(e) => setTopic(e.target.value as Topic)}
          >
            {TOPIC_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-black">
          <span>レベル</span>
          <select
            className="border border-neutral-300 rounded-md px-3 py-2 bg-white text-black"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
          >
            {[1,2,3,4,5].map(n => <option key={n} value={n}>Lv{n}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-black">
          <span>出題数</span>
          <input
            type="number"
            min={1}
            max={20}
            className="border border-neutral-300 rounded-md px-3 py-2 bg-white text-black"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={handleClick}
          disabled={busy}
          className="rounded-2xl px-4 py-2 border border-neutral-900 text-black disabled:opacity-50"
        >
          {busy ? "生成中..." : "生成"}
        </button>
        {err && <div className="text-sm text-red-600">{err}</div>}
      </div>
    </div>
  );
}
