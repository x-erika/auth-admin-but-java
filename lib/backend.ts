import { getSessionToken } from "./session";

const BACKEND =
  process.env.AUTH_BACKEND_URL?.replace(/\/$/, "") ?? "http://localhost:8080";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  token?: string | null;
  skipAuth?: boolean;
};

export type BackendResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string };

export async function backend<T>(
  path: string,
  opts: FetchOptions = {},
): Promise<BackendResult<T>> {
  const token = opts.skipAuth
    ? undefined
    : (opts.token ?? (await getSessionToken()));

  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  let body: BodyInit | undefined;
  if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND}${path}`, {
      method: opts.method ?? "GET",
      headers,
      body,
      cache: "no-store",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[backend] fetch ${path} failed: ${message}`);
    return {
      ok: false,
      status: 0,
      error: `Cannot reach auth server at ${BACKEND}. Is it running? (${message})`,
    };
  }

  if (!res.ok) {
    let error = res.statusText || `HTTP ${res.status}`;
    try {
      const data = (await res.json()) as Record<string, unknown>;
      const message =
        (data.message as string | undefined) ??
        (data.error_description as string | undefined) ??
        (data.error as string | undefined);
      if (message) error = message;
    } catch {
      // body wasn't JSON
    }
    return { ok: false, status: res.status, error };
  }

  if (res.status === 204) {
    return { ok: true, data: undefined as T };
  }

  const data = (await res.json()) as T;
  return { ok: true, data };
}
