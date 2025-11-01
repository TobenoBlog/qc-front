"use client";
import { useEffect, useState } from "react";
import type { ProgressSummary } from "@/lib/api";
import { getProgress } from "@/lib/api";

const LABELS: Record<string, string> = {
  mean: "平均",
  variance: "分散",
  correlation: "相関",
  simple_regression: "回帰",
  p_chart: "p管理図",
};

export default function ProgressPanel() {
  const [p, setP] = useState<ProgressSummary | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProgress();
        setP(data);
      } catch (e: any) {
        setErr(String(e));
      }
    })();
  }, []);

  if (err) {
    return (
      <div className="qc-card p-4">
        <h2 className="font-semibold mb-2">📈 進捗</h2>
        <p className="text-sm text-red-600">進捗の取得に失敗しました：{err}</p>
      </div>
    );
  }
  if (!p) {
    return (
      <div className="qc-card p-4">
        <h2 className="font-semibold mb-2">📈 進捗</h2>
        <p className="text-sm text-gray-600">読み込み中…</p>
      </div>
    );
  }

  const accPct = Math.round((p.accuracy || 0) * 100);

  return (
    <div className="qc-card p-4 space-y-3">
      <h2 className="font-semibold">📈 進捗</h2>
      <div className="text-sm">
        <div>総問題数：<b>{p.total}</b></div>
        <div>正解数：<b>{p.correct}</b></div>
        <div>正答率：<b>{accPct}%</b></div>
      </div>

      <div className="border-t pt-2">
        <h3 className="font-medium text-sm mb-1">カテゴリ別</h3>
        <ul className="text-sm space-y-1">
          {Object.entries(p.by_type).map(([k, v]) => {
            const pct = v.total ? Math.round((v.correct / v.total) * 100) : 0;
            return (
              <li key={k} className="flex justify-between">
                <span>{LABELS[k] ?? k}</span>
                <span>{v.correct}/{v.total}（{pct}%）</span>
              </li>
            );
          })}
          {Object.keys(p.by_type).length === 0 && (
            <li className="text-gray-600">まだデータがありません</li>
          )}
        </ul>
      </div>
    </div>
  );
}
