// lib/api.ts
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
  // 他、必要ならここに拡張
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
