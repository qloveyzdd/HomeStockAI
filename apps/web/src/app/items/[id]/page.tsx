import { notFound } from "next/navigation";

import {
  normalizeHouseholdItem,
  normalizeInventoryState,
  normalizePurchaseRecords,
  type HouseholdItemApiResponse,
  type InventoryStateApiResponse,
  type PurchaseRecordApiResponse,
} from "@/lib/api-client";
import { AppShell } from "@/components/app-shell";
import { ItemDetailHero } from "@/components/items/item-detail-hero";
import { InventoryStatusCard } from "@/components/items/inventory-status-card";
import { PurchaseRecordList } from "@/components/items/purchase-record-list";
import { serverApiFetch, serverApiFetchOrNull } from "@/lib/server-api";
import { requireCompletedSetup } from "@/lib/server-session";

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireCompletedSetup();
  const { id } = await params;

  try {
    const [itemPayload, inventoryPayload, recordPayload] = await Promise.all([
      serverApiFetch<HouseholdItemApiResponse>(`/items/${id}`),
      serverApiFetchOrNull<InventoryStateApiResponse>(`/items/${id}/inventory-state`),
      serverApiFetch<PurchaseRecordApiResponse[]>(`/purchase-records?item_id=${encodeURIComponent(id)}`),
    ]);

    const item = normalizeHouseholdItem(itemPayload);
    const inventoryState = inventoryPayload ? normalizeInventoryState(inventoryPayload) : null;
    const records = normalizePurchaseRecords(recordPayload);

    return (
      <AppShell title="物品详情" activeTab="items">
        <div className="space-y-4">
          <ItemDetailHero item={item} inventoryState={inventoryState} />
          <InventoryStatusCard item={item} inventoryState={inventoryState} />
          <PurchaseRecordList records={records} unit={item.unit} />
        </div>
      </AppShell>
    );
  } catch {
    notFound();
  }
}
