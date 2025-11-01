import { proxyJson } from "@/app/api/_utils";

export async function POST(req: Request) {
  const body = await req.json();
  return proxyJson("/progress", "POST", body);
}

// 進捗ダッシュボード用に GET も中継
export async function GET() {
  return proxyJson("/progress", "GET");
}
