import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { EmptyStateCard } from "@/components/items/empty-state-card";
import { ItemSummaryCard } from "@/components/items/item-summary-card";
import { Button } from "@/components/ui/button";
import { serverApiFetch } from "@/lib/server-api";
import { requireCompletedSetup } from "@/lib/server-session";

export default async function ItemsPage() {
  await requireCompletedSetup();
  const items = await serverApiFetch<
    Array<{
      id: string;
      name: string;
      category: string;
      brand: string;
      spec_text: string;
      enabled: boolean;
      is_custom: boolean;
    }>
  >("/items");

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
          items.map((item) => (
            <ItemSummaryCard
              key={item.id}
              item={{
                id: item.id,
                name: item.name,
                category: item.category,
                brand: item.brand,
                specText: item.spec_text,
                enabled: item.enabled,
                isCustom: item.is_custom,
              }}
            />
          ))
        )}
      </div>
    </AppShell>
  );
}

