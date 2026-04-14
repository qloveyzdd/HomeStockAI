import { redirect } from "next/navigation";

import type { AuthSessionResponse } from "@refillwise/shared-types";

import { normalizeSessionResponse } from "@/lib/api-client";
import { serverApiFetch } from "@/lib/server-api";

export async function getServerSession(): Promise<AuthSessionResponse> {
  try {
    const payload = await serverApiFetch<{
      account: AuthSessionResponse["account"];
      household_id: string | null;
      setup_completed: boolean;
    }>("/auth/me");

    return normalizeSessionResponse(payload);
  } catch {
    return {
      account: null,
      householdId: null,
      setupCompleted: false,
    };
  }
}

export async function requireServerSession() {
  const session = await getServerSession();
  if (!session.account) {
    redirect("/login");
  }

  return session;
}

export async function requireCompletedSetup() {
  const session = await requireServerSession();
  if (!session.setupCompleted) {
    redirect("/setup");
  }

  return session;
}
