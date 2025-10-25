// app/api/generate/route.ts
import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!; // 例: https://qc-api.onrender.com
// 必要なら JWT を挿入
const API_JWT = process.env.API_JWT; // ない場合は undefined でOK

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_BASE}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_JWT ? { Authorization: `Bearer ${API_JWT}` } : {}),
      },
      body: JSON.stringify(body),
      // サーバー→サーバーなので credentials は不要
    });

    const text = await res.text();
    // バックエンドのステータスをそのまま返す
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "proxy error" }, { status: 500 });
  }
}
