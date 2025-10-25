export type ProblemType = "mean" | "variance" | "correlation" | "simple_regression" | "p_chart";

export type GenerateBody = { type: ProblemType; level: number; n: number; };
export type GeneratedProblem = { problem_id: string; type: ProblemType; question: string; data: any; tolerance: number; };
export type GradeBody = { problem_id: string; answer_number?: number; answer_tuple?: [number, number]; };
export type GradeResult = { correct: boolean; expected: number | [number, number]; score: number; feedback: string; };
export type ProgressSummary = {
  user_id: string;
  total: number; correct: number; accuracy: number;
  by_type: Record<string, { total: number; correct: number }>;
};
