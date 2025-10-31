// /middleware.ts  ← ルートに置く
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const jwt = url.searchParams.get("jwt");
  if (jwt) {
    const clean = new URL(url.origin + url.pathname);   // ?jwt を除去してリダイレクト
    const res = NextResponse.redirect(clean);
    res.cookies.set("qc_jwt", jwt, {
      httpOnly: true,
      secure: true,
      sameSite: "none",  // iframe で他ドメインから埋め込むため
      path: "/",
      maxAge: 60 * 60,
    });
    return res;
  }
  return NextResponse.next();
}
