export type GenerateRequest = {
  topic: string;
  level: number;
  count: number;
};

export type GeneratedProblem = {
  id: string;
  title: string;
  body?: string;
};

export type GradeRequest = {
  questionId: string;
  answer: string;
};

export type GradeResult = {
  correct: boolean;
  feedback?: { message: string; expected?: number; tolerance?: number };
};

export type ProgressResult = {
  ok: boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
const TOKEN = typeof window !== "undefined" ? localStorage.getItem("qc_jwt") : null;

async function postJson<T>(path: string, data: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  return res.json();
}

export async function postGenerate(req: GenerateRequest) {
  return postJson<{ problems: GeneratedProblem[] }>("/generate", req);
}

export async function postGrade(req: GradeRequest) {
  return postJson<GradeResult>("/grade", req);
}

export async function postProgress(req: GradeRequest) {
  return postJson<ProgressResult>("/progress", req);
}
