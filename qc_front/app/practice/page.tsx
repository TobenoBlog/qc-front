// app/practice/page.tsx
import { cookies } from "next/headers";
import PracticeFlow from "@/components/PracticeFlow";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function PracticePage({ searchParams }: Props) {
  const jwt = typeof searchParams?.jwt === "string" ? searchParams!.jwt : undefined;
  if (jwt) {
    // Secure/None は本番 https 環境で有効。http 環境なら Lax に落とすなど調整してください。
    cookies().set("qc_jwt", jwt, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60, // 1h
    });
  }

  return <PracticeFlow />;
}
