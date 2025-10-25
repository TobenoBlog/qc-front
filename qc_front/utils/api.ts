export async function apiFetch<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const base = process.env.NEXT_PUBLIC_QC_API_BASE!;
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });

  if (res.status === 429) {
    await new Promise(r => setTimeout(r, 800));
    return apiFetch<T>(path, token, init);
  }
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
}

