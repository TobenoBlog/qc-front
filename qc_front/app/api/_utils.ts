// qc_front/app/api/_utils.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// サーバー専用の環境変数（公開しない）
export const API_BASE = process.env.API_BASE || ""; // 例: https://qc-api-1.onrender.com

async function getJwtFromCookie(): Promise<string | null> {
  const c = await cookies();                // Next v15はPromise
  return c.get("qc_jwt")?.value ?? null;    // iframe内ドメインのCookie
}

export async function proxyJson(path: string, method: "POST"|"GET", body?: unknown) {
  if (!API_BASE) {
    return NextResponse.json({ error: "API_BASE env is not set on Vercel" }, { status: 500 });
  }
  const jwt = await getJwtFromCookie();
  if (!jwt) {
    return NextResponse.json({ detail: "Missing token (frontend)" }, { status: 401 });
  }
  let upstream: Response;
  try {
    upstream = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,     // Cookie→Bearerに変換
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch (e: any) {
    return NextResponse.json({ error: "fetch to API_BASE failed", message: String(e), API_BASE }, { status: 502 });
  }

  const text = await upstream.text(); // そのまま中継
  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json" },
  });
}
