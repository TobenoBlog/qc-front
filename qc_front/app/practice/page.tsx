// app/practice/page.tsx
import { cookies } from "next/headers";
import PracticeFlow from "@/components/PracticeFlow";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

// ★ async 関数にして cookies() を await
export default async function PracticePage({ searchParams }: Props) {
  const jwt = typeof searchParams?.jwt === "string" ? searchParams.jwt : undefined;
  if (jwt) {
    const jar = await cookies();  // ← await が必要
    jar.set("qc_jwt", jwt, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60, // 1時間
    });
  }
  return <PracticeFlow />;
}
