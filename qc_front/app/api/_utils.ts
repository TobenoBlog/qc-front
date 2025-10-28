// app/api/_utils.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const API_BASE = process.env.API_BASE || "";

export async function getJwtFromCookie(): Promise<string | null> {
  // 👇 cookies() が Promise になったので await が必要
  const c = await cookies();
  return c.get("qc_jwt")?.value ?? null;
}

export async function proxyJson(
  path: string,
  method: "POST" | "GET",
  body?: unknown
) {
  if (!API_BASE) {
    return NextResponse.json(
      { error: "API_BASE env is not set on Vercel" },
      { status: 500 }
    );
  }

  const jwt = await getJwtFromCookie();
  if (!jwt) {
    return NextResponse.json(
      { detail: "Missing token (frontend)" },
      { status: 401 }
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "fetch to API_BASE failed", message: String(e), API_BASE },
      { status: 502 }
    );
  }

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("Content-Type") ?? "application/json",
    },
  });
}
