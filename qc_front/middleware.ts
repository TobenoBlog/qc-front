// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const jwt = url.searchParams.get("jwt");

  // /practice に ?jwt=... が付いて来たら Cookie に保存してクエリを取り除く
  if (jwt && url.pathname.startsWith("/practice")) {
    const clean = new URL(url.origin + url.pathname); // クエリ抜き
    const res = NextResponse.redirect(clean);

    // 本番 https 前提。ローカル http の時は sameSite:"lax", secure:false でもOK
    res.cookies.set("qc_jwt", jwt, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60, // 1h
    });

    return res;
  }

  return NextResponse.next();
}

// /practice だけを見る
export const config = {
  matcher: ["/practice"],
};
