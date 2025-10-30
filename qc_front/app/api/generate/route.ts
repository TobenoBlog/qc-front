// qc_front/app/api/generate/route.ts
import { proxyJson } from "@/app/api/_utils";

export async function POST(req: Request) {
  const body = await req.json();
  return proxyJson("/generate", "POST", body);
}
