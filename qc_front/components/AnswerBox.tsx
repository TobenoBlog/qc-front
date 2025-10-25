// components/AnswerBox.tsx
"use client";

import { useEffect, useRef, useState } from "react";

export type AnswerBoxProps = {
  // 採点処理（API呼び出しなど）を親から注入
  onGrade: (value: string) => void | Promise<void>;
  placeholder?: string;
  inputMode?: "text" | "numeric" | "decimal" | "search";
  className?: string;
};

export default function AnswerBox({
  onGrade,
  placeholder = "解答を入力",
  inputMode = "text",
  className = "",
}: AnswerBoxProps) {
  const [answer, setAnswer] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const lastGradedRef = useRef("");

  // 入力
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ここでクリアしない！常にそのまま反映
    setAnswer(e.target.value);
  };

  // 日本語IME合成開始/終了
  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    // 一部環境で未確定が確定に反映されないことがあるため保険
    setAnswer(e.currentTarget.value);
  };

  // Enterでフォーム送信させない（再マウント/フォーカスロスト防止）
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  // デバウンス採点：タイピングが止まってから実行（IME中は止める）
  useEffect(() => {
    if (isComposing) return;
    const t = setTimeout(async () => {
      if (answer !== "" && answer !== lastGradedRef.current) {
        await onGrade(answer); // ここで入力をクリアしない
        lastGradedRef.current = answer;
      }
    }, 250);
    return () => clearTimeout(t);
  }, [answer, isComposing, onGrade]);

  return (
    <input
      type="text"
      inputMode={inputMode}
      value={answer}
      onChange={handleChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onKeyDown={handleKeyDown}
      className={
        "w-full border border-neutral-300 rounded-md px-3 py-2 text-black placeholder-neutral-500 outline-none focus:ring-2 focus:ring-neutral-800 " +
        className
      }
      placeholder={placeholder}
      autoComplete="off"
    />
  );
}
