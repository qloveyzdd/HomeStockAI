import { notFound } from "next/navigation";

import {
  normalizeHouseholdItem,
  type HouseholdItemApiResponse,
} from "@/lib/api-client";
import { AppShell } from "@/components/app-shell";
import { PurchaseRecordForm } from "@/components/items/purchase-record-form";
import { serverApiFetch } from "@/lib/server-api";
import { requireCompletedSetup } from "@/lib/server-session";

export default async function NewPurchaseRecordPage({ params }: { params: Promise<{ id: string }> }) {
  await requireCompletedSetup();
  const { id } = await params;

  try {
    const itemPayload = await serverApiFetch<HouseholdItemApiResponse>(`/items/${id}`);
    const item = normalizeHouseholdItem(itemPayload);

    return (
      <AppShell title="添加购买记录" activeTab="items">
        <PurchaseRecordForm item={item} />
      </AppShell>
    );
  } catch {
    notFound();
  }
}
