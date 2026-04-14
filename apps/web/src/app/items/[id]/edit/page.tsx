import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { ItemForm } from "@/components/items/item-form";
import { serverApiFetch } from "@/lib/server-api";
import { requireCompletedSetup } from "@/lib/server-session";

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  await requireCompletedSetup();
  const { id } = await params;

  try {
    const [catalog, item] = await Promise.all([
      serverApiFetch<Array<{ category: string; unit: string; safety_stock_days: number }>>("/items/catalog"),
      serverApiFetch<{
        id: string;
        household_id: string;
        name: string;
        category: string;
        brand: string | null;
        spec_text: string | null;
        unit: string;
        safety_stock_days: number;
        preferred_platform: string | null;
        replaceable: boolean;
        enabled: boolean;
        is_custom: boolean;
      }>(`/items/${id}`),
    ]);

    return (
      <AppShell title="编辑物品" activeTab="items">
        <ItemForm mode="edit" catalog={catalog} initialItem={item} />
      </AppShell>
    );
  } catch {
    notFound();
  }
}
