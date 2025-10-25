'use client';
// app/practice/page.tsx
import dynamic from "next/dynamic";

// SSRなしで PracticeFlow を遅延読み込み
const Flow = dynamic(() => import("@/components/PracticeFlow"), { ssr: false });

export default function PracticePage() {
  return <Flow />;
}
