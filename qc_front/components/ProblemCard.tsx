// components/ProblemCard.tsx
"use client";

import { useCallback, useState } from "react";
import AnswerBox from "./AnswerBox";
import { postGrade, postProgress, GradeResponse } from "@/lib/api";

export type ProblemCardProps = {
  questionId: string;
  title: string;
  body?: string;
};

export default function ProblemCard({ questionId, title, body }: ProblemCardProps) {
  const [feedback, setFeedback] = useState<GradeResponse["feedback"] | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  // 採点処理：AnswerBox から注入される
  const handleGrade = useCallback(
    async (value: string) => {
      if (busy) return; // 連打対策
      try {
        setBusy(true);
        const grade = await postGrade({ questionId, answer: value });
        setIsCorrect(grade.correct);
        setFeedback(grade.feedback ?? null);

        // 成否にかかわらず進捗更新（要件に合わせてif (grade.correct) にしてもOK）
        await postProgress(questionId);
      } catch (e) {
        // ここでは UI だけに留める。入力はリセットしない！
        console.error(e);
      } finally {
        setBusy(false);
      }
    },
    [questionId, busy]
  );

  return (
    <div
      // !!! ここに不安定な key を置かない !!!
      className="rounded-2xl border border-neutral-200 p-4"
    >
      <div className="text-lg font-semibold text-black">{title}</div>
      {body && <div className="mt-1 text-sm text-neutral-700">{body}</div>}

      <div className="mt-3">
        <AnswerBox
          onGrade={handleGrade}
          inputMode="decimal" // 数値なら "numeric" or "decimal"
          placeholder="解答を入力"
        />
        {busy && <div className="mt-2 text-sm text-neutral-600">採点中...</div>}
      </div>

      {isCorrect !== null && (
        <div className="mt-3">
          {isCorrect ? (
            <div className="border border-neutral-900 rounded-lg p-3 text-black">
              正解です。進捗を更新しました。
            </div>
          ) : (
            <div className="border border-neutral-900 rounded-lg p-3 text-black">
              <div className="font-semibold">フィードバック</div>
              <div className="mt-1 whitespace-pre-line">
                {feedback?.message ?? "もう一度チャレンジしましょう。"}
              </div>
              {feedback?.expected !== undefined && (
                <div className="mt-2 text-sm">
                  期待値: <span className="font-mono">{String(feedback.expected)}</span>
                  {feedback?.tolerance !== undefined && (
                    <>
                      <br />
                      許容差: <span className="font-mono">±{feedback.tolerance}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
