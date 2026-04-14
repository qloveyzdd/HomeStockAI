import Link from "next/link";

import {
  normalizeHouseholdItems,
  type HouseholdItemApiResponse,
} from "@/lib/api-client";
import { AppShell } from "@/components/app-shell";
import { EmptyStateCard } from "@/components/items/empty-state-card";
import { ItemSummaryCard } from "@/components/items/item-summary-card";
import { Button } from "@/components/ui/button";
import { serverApiFetch } from "@/lib/server-api";
import { requireCompletedSetup } from "@/lib/server-session";

export default async function ItemsPage() {
  await requireCompletedSetup();
  const payload = await serverApiFetch<HouseholdItemApiResponse[]>("/items");
  const items = normalizeHouseholdItems(payload);

  return (
    <AppShell
      title="物品"
      activeTab="items"
      action={
        <Link href="/items/new">
          <Button type="button" className="w-auto px-4">
            添加物品
          </Button>
        </Link>
      }
    >
      <div className="space-y-4">
        {items.length === 0 ? (
          <EmptyStateCard />
        ) : (
          items.map((item) => <ItemSummaryCard key={item.id} item={item} />)
        )}
      </div>
    </AppShell>
  );
}
