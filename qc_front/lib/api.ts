// qc_front/lib/api.ts
export type GenerateRequest = { topic: string; level: number; count: number };
export type GeneratedProblem = { id: string; title: string; body?: string };
export type GradeRequest = { questionId: string; answer: string };
export type GradeResult = { correct: boolean; feedback?: { message: string; expected?: number; tolerance?: number } };
export type ProgressResult = { ok: boolean };

async function postJson<T>(path: string, data: unknown): Promise<T> {
  // 相対パスで Next の API を叩く（Cookieはサーバー側でBearerに変換）
  const res = await fetch(`/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  return res.json();
}

export function postGenerate(req: GenerateRequest) {
  return postJson<{ problems: GeneratedProblem[] }>("/generate", req);
}
export function postGrade(req: GradeRequest) {
  return postJson<GradeResult>("/grade", req);
}
export function postProgress(req: GradeRequest) {
  return postJson<ProgressResult>("/progress", req);
}
