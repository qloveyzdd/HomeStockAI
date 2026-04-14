import type { AuthSessionResponse } from "@refillwise/shared-types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

export function buildApiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    cache: "no-store",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.detail ?? "请求失败");
  }

  return response.json() as Promise<T>;
}

export function normalizeSessionResponse(payload: {
  account: AuthSessionResponse["account"];
  household_id: string | null;
  setup_completed: boolean;
}): AuthSessionResponse {
  return {
    account: payload.account,
    householdId: payload.household_id,
    setupCompleted: payload.setup_completed,
  };
}
