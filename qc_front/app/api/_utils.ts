// app/api/_utils.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const API_BASE = process.env.API_BASE || ""; // ← 未設定だと空

export function getJwtFromCookie(): string | null {
  return cookies().get("qc_jwt")?.value ?? null;
}

export async function proxyJson(path: string, method: "POST" | "GET", body?: unknown) {
  if (!API_BASE) {
    // ★ 500の主因その1: API_BASE未設定
    return NextResponse.json(
      { error: "API_BASE env is not set on Vercel" },
      { status: 500 }
    );
  }

  const jwt = getJwtFromCookie();
  if (!jwt) {
    // ★ 500じゃなく 401 を明示
    return NextResponse.json({ detail: "Missing token (frontend)" }, { status: 401 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`, // ← ここ超重要
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch (e: any) {
    // ★ ネットワーク不可時の見える化
    return NextResponse.json(
      { error: "fetch to API_BASE failed", message: String(e), API_BASE },
      { status: 502 }
    );
  }

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json" },
  });
}
