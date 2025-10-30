"use client";
import dynamic from "next/dynamic";
const Flow = dynamic(() => import("@/components/PracticeFlow"), { ssr: false });

export default function PracticePage() {
  return (
    <div className="max-w-3xl mx-auto my-8 space-y-6 px-4">
      <h1 className="text-2xl font-bold text-center tracking-tight">📘 QC検定 計算演習</h1>
      <Flow />
    </div>
  );
}
