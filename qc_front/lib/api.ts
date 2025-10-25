// qc_front/lib/api.ts

// ====== Generate ======
export type Topic = "mean" | "variance" | "correlation" | "pchart" | "regression";

export type GenerateRequest = {
  topic: Topic;     // 例: "mean"
  level: number;    // 例: 1〜5
  count: number;    // 例: 1〜20
};

export type GeneratedProblem = {
  id: string;
  title: string;
  body?: string;
};

export type GenerateResponse = {
  problems: GeneratedProblem[];
};

export async function postGenerate(req: GenerateRequest): Promise<GenerateResponse> {
  const res = await fetch("/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`/generate ${res.status} ${txt.slice(0, 160)}`);
  }
  // 期待レスポンス: { problems: [{ id, title, body? }, ...] }
  return res.json();
}

// ====== Grade / Progress ======
export type GradeRequest = {
  questionId: string;
  answer: string;
};

export type GradeResponse = {
  correct: boolean;
  feedback?: {
    message: string;
    expected?: string | number;
    tolerance?: number;
  };
};

export async function postGrade(req: GradeRequest): Promise<GradeResponse> {
  const res = await fetch("/grade", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`/grade ${res.status} ${txt.slice(0, 120)}`);
  }
  return res.json();
}

export async function postProgress(questionId: string): Promise<{ ok: boolean }> {
  const res = await fetch("/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ questionId }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`/progress ${res.status} ${txt.slice(0, 120)}`);
  }
  return res.json();
}
