// qc_front/lib/api.ts
export type GenerateRequest = { topic: string; level: number; count: number };
export type GeneratedProblem = { id: string; title: string; body?: string };
export type GradeRequest = { questionId: string; answer: string };
export type GradeResult = { correct: boolean; feedback?: { message: string; expected?: number; tolerance?: number } };
export type ProgressResult = { ok: boolean };

async function postJson<T>(path: string, data: unknown): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  return res.json();
}
export const postGenerate = (req: GenerateRequest) => postJson<{ problems: GeneratedProblem[] }>("/generate", req);
export const postGrade     = (req: GradeRequest)     => postJson<GradeResult>("/grade", req);
export const postProgress  = (req: GradeRequest)     => postJson<ProgressResult>("/progress", req);
