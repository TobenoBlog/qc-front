// app/api/grade/route.ts
import { proxyJson } from "@/app/api/_utils";

export async function POST(req: Request) {
  const body = await req.json();
  return proxyJson("/grade", "POST", body);
}
