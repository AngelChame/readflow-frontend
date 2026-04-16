export async function adminFetch(path: string, options?: RequestInit) {
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? "readflow_admin_2026";

  const res = await fetch(`${process.env.EXTERNAL_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": ADMIN_TOKEN,
      ...options?.headers,
    },
  });

  return res;
}
