"use client";
import { useState } from "react";
import { postGenerate, postGrade } from "@/lib/api";

export default function PracticePage() {
  const [topic, setTopic] = useState("mean");
  const [level, setLevel] = useState(1);
  const [problems, setProblems] = useState<any[]>([]);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<any | null>(null);

  async function handleGenerate() {
    const data = await postGenerate({ topic, level, count: 1 });
    setProblems(data.problems);
    setResult(null);
  }

  async function handleGrade() {
    if (!problems[0]) return;
    const data = await postGrade({ questionId: problems[0].id, answer });
    setResult(data);
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        📘 QC検定 計算演習
      </h1>

      {/* 出題設定 */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-300">出題設定</h2>
        <label className="block mb-2">
          カテゴリ
          <select
            className="block w-full mt-1 bg-gray-800 border border-gray-500 rounded p-2 text-white"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="mean">平均</option>
            <option value="variance">分散</option>
            <option value="correlation">相関</option>
            <option value="regression">回帰</option>
            <option value="pchart">p管理図</option>
          </select>
        </label>

        <label className="block mb-4">
          レベル（1〜3）
          <input
            type="number"
            min="1"
            max="3"
            className="block w-24 mt-1 bg-gray-800 border border-gray-500 rounded p-2 text-white"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
          />
        </label>

        <button
          onClick={handleGenerate}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow"
        >
          🧮 問題を生成
        </button>
      </section>

      {/* 問題表示 */}
      {problems.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-green-300">問題</h2>
          <p className="whitespace-pre-wrap bg-gray-900 border border-gray-700 rounded p-3 mb-3 text-gray-100">
            {problems[0].title}
          </p>

          <input
            type="text"
            placeholder="ここに解答を入力"
            className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white mb-4"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button
            onClick={handleGrade}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded shadow"
          >
            ✅ 採点する
          </button>
        </section>
      )}

      {/* 採点結果 */}
      {result && (
        <section>
          <h2 className="text-lg font-semibold mb-3 text-red-300">採点結果</h2>
          <div
            className={`border rounded p-4 ${
              result.correct
                ? "border-green-400 bg-green-900/30"
                : "border-red-400 bg-red-900/30"
            }`}
          >
            {result.correct ? (
              <p className="text-green-300 font-bold">⭕ 正解！</p>
            ) : (
              <p className="text-red-300 font-bold">❌ 不正解</p>
            )}
            <p className="mt-2 text-gray-100">
              {result.feedback?.message}
              <br />
              期待値 {result.feedback?.expected} / あなた {answer}（許容±
              {result.feedback?.tolerance ?? 0.05}）
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
