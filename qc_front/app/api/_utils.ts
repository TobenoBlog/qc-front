// app/api/_utils.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const API_BASE = process.env.API_BASE!; // 例: https://qc-api.onrender.com

export function getJwtFromCookie(): string | null {
  const c = cookies().get("qc_jwt");
  return c?.value ?? null;
}

export async function proxyJson(
  path: string,
  method: "POST" | "GET",
  body?: unknown
) {
  const jwt = getJwtFromCookie();
  if (!jwt) {
    return NextResponse.json({ detail: "Missing token (frontend)" }, { status: 401 });
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`,      // ★ Authorization に載せる
    },
    body: body ? JSON.stringify(body) : undefined,
    // サーバー→サーバー通信なので credentials は不要
    cache: "no-store",
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}
