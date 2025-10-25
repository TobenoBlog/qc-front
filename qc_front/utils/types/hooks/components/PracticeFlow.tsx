"use client";
import React from "react";
import { useJwtFromParent } from "../hooks/useJwtFromParent";
import { apiFetch } from "../utils/api";
import type {
  ProblemType, GenerateBody, GeneratedProblem, GradeBody, GradeResult, ProgressSummary
} from "../types/qc";

export default function PracticeFlow() {
  const token = useJwtFromParent();
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string|null>(null);

  const [form, setForm] = React.useState<GenerateBody>({ type: "mean", level: 1, n: 8 });
  const [problem, setProblem] = React.useState<GeneratedProblem|null>(null);
  const [grade, setGrade] = React.useState<GradeResult|null>(null);
  const [progress, setProgress] = React.useState<ProgressSummary|null>(null);
  const [ansNumber, setAnsNumber] = React.useState("");
  const [ansA, setAnsA] = React.useState("");
  const [ansB, setAnsB] = React.useState("");

  const needToken = () => {
    if (!token) throw new Error("JWT未受領：WPのpostMessage または ?token= を確認してください。");
    return token;
  };

  const onGenerate = async () => {
    try {
      setErr(null); setLoading(true); setGrade(null);
      const data = await apiFetch<GeneratedProblem>("/generate", needToken(), {
        method: "POST", body: JSON.stringify(form),
      });
      setProblem(data);
    } catch (e:any) { setErr(e.message); }
    finally { setLoading(false); }
  };

  const onGrade = async () => {
    if (!problem) return;
    try {
      setErr(null); setLoading(true);
      const body: GradeBody = { problem_id: problem.problem_id };
      if (problem.type === "simple_regression") {
        body.answer_tuple = [Number(ansA), Number(ansB)];
      } else {
        body.answer_number = Number(ansNumber);
      }
      const g = await apiFetch<GradeResult>("/grade", needToken(), { method: "POST", body: JSON.stringify(body) });
      setGrade(g);
      const p = await apiFetch<ProgressSummary>("/progress", needToken());
      setProgress(p);
    } catch (e:any) { setErr(e.message); }
    finally { setLoading(false); }
  };

  const AnswerInputs = () => {
    if (!problem) return null;
    return problem.type === "simple_regression" ? (
      <div className="grid grid-cols-2 gap-2">
        <input className="border p-2 rounded" placeholder="a（傾き）" value={ansA} onChange={e=>setAnsA(e.target.value)} />
        <input className="border p-2 rounded" placeholder="b（切片）" value={ansB} onChange={e=>setAnsB(e.target.value)} />
      </div>
    ) : (
      <input className="border p-2 rounded w-full" placeholder="回答（数値）" value={ansNumber} onChange={e=>setAnsNumber(e.target.value)} />
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">QC演習フロー</h1>

      {!token && <div className="p-3 border rounded bg-yellow-50">JWT待機中…（WPからpostMessage、または ?token=）</div>}

      <section className="space-y-2">
        <h2 className="font-semibold">1) 問題生成</h2>
        <div className="grid grid-cols-3 gap-2">
          <select className="border p-2 rounded" value={form.type} onChange={e=>setForm({...form, type: e.target.value as ProblemType})}>
            <option value="mean">平均</option>
            <option value="variance">分散（母分散）</option>
            <option value="correlation">相関係数</option>
            <option value="simple_regression">単回帰</option>
            <option value="p_chart">p管理図（p̄）</option>
          </select>
          <select className="border p-2 rounded" value={form.level} onChange={e=>setForm({...form, level: Number(e.target.value)})}>
            <option value={1}>Lv1</option><option value={2}>Lv2</option><option value={3}>Lv3</option>
          </select>
          <input className="border p-2 rounded" type="number" min={4} max={200} value={form.n} onChange={e=>setForm({...form, n: Number(e.target.value)})}/>
        </div>
        <button className="px-4 py-2 rounded bg-black text-white disabled:opacity-60" onClick={onGenerate} disabled={loading || !token}>生成</button>
      </section>

      {problem && (
        <section className="space-y-2">
          <h2 className="font-semibold">2) 出題</h2>
          <div className="p-3 border rounded bg-gray-50 whitespace-pre-wrap">{problem.question}</div>
          <details className="p-2 border rounded bg-white"><summary>データを見る</summary><pre className="text-sm overflow-auto">{JSON.stringify(problem.data, null, 2)}</pre></details>
          <h3 className="font-medium">3) 回答</h3>
          <AnswerInputs />
          <button className="px-4 py-2 rounded bg-black text-white disabled:opacity-60" onClick={onGrade} disabled={loading || !token}>採点</button>
        </section>
      )}

      {grade && (
        <section className="space-y-2">
          <h2 className="font-semibold">4) 採点結果</h2>
          <div className={`p-3 border rounded ${grade.correct ? "bg-green-50" : "bg-red-50"}`}>
            <div className="font-bold">{grade.correct ? "正解！" : "不正解"}</div>
            <div className="text-sm">{grade.feedback}</div>
          </div>
        </section>
      )}

      {progress && (
        <section className="space-y-2">
          <h2 className="font-semibold">5) 進捗</h2>
          <div className="p-3 border rounded bg-blue-50">
            <div>総問数: {progress.total} / 正答: {progress.correct} / 正答率: {(progress.accuracy*100).toFixed(1)}%</div>
            <pre className="text-sm overflow-auto">{JSON.stringify(progress.by_type, null, 2)}</pre>
          </div>
        </section>
      )}

      {loading && <div>通信中…</div>}
      {err && <div className="p-3 border rounded bg-red-100">{err}</div>}
    </div>
  );
}
