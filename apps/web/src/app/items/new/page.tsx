import { AppShell } from "@/components/app-shell";
import { ItemForm } from "@/components/items/item-form";
import { serverApiFetch } from "@/lib/server-api";
import { requireCompletedSetup } from "@/lib/server-session";

export default async function NewItemPage() {
  await requireCompletedSetup();
  const catalog = await serverApiFetch<Array<{ category: string; unit: string; safety_stock_days: number }>>(
    "/items/catalog",
  );

  return (
    <AppShell title="添加物品" activeTab="items">
      <ItemForm mode="create" catalog={catalog} />
    </AppShell>
  );
}

