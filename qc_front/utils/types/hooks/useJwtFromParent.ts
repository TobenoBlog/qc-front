import { useEffect, useState } from "react";

const ALLOWED_ORIGINS = [
  "https://tobenicelife.com", // 親（WP）
];

export function useJwtFromParent() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // フォールバック: ?token=... でも可
    try {
      const url = new URL(window.location.href);
      const t = url.searchParams.get("token");
      if (t) setToken(t);
    } catch {}

    const onMsg = (e: MessageEvent) => {
      if (!ALLOWED_ORIGINS.includes(e.origin)) return;
      if (e?.data?.type === "QC_JWT" && typeof e?.data?.token === "string") {
        setToken(e.data.token);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return token;
}
