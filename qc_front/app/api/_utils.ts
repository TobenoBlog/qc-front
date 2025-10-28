// app/api/_utils.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const API_BASE = process.env.API_BASE!; // 例: https://qc-api.onrender.com

// ★ Promise になっているので async/await で取得する
export async function getJwtFromCookie(): Promise<string | null> {
  const jar = await cookies();          // ← ここを await に
  const c = jar.get("qc_jwt");
  return c?.value ?? null;
}

export async function proxyJson(
  path: string,
  method: "POST" | "GET",
  body?: unknown
) {
  const jwt = await getJwtFromCookie(); // ← await に変更
  if (!jwt) {
    return NextResponse.json({ detail: "Missing token (frontend)" }, { status: 401 });
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}
