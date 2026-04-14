import Link from "next/link";

import type { HouseholdItemDetail, InventoryState } from "@refillwise/shared-types";

import { InventoryStatusBadge } from "@/components/items/inventory-status-badge";
import { Card, CardContent } from "@/components/ui/card";

export function ItemDetailHero({
  item,
  inventoryState,
}: {
  item: HouseholdItemDetail;
  inventoryState: InventoryState | null;
}) {
  return (
    <Card className="overflow-hidden bg-white p-0">
      <div className="bg-[linear-gradient(135deg,#f0e5d3_0%,#dce9de_100%)] px-5 py-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[var(--muted-foreground)]">{item.category}</p>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">{item.name}</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              {item.brand || "未填写品牌"} · {item.specText || "未填写规格"}
            </p>
          </div>
          <InventoryStatusBadge
            status={item.inventoryStatus}
            estimatedRemainingDays={inventoryState?.estimatedRemainingDays ?? item.estimatedRemainingDays}
          />
        </div>
      </div>

      <CardContent className="space-y-4 px-5 py-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-[var(--surface)] px-4 py-3">
            <p className="text-xs text-[var(--muted-foreground)]">安全库存</p>
            <p className="mt-1 text-lg font-semibold">{item.safetyStockDays} 天</p>
          </div>
          <div className="rounded-2xl bg-[var(--surface)] px-4 py-3">
            <p className="text-xs text-[var(--muted-foreground)]">常用单位</p>
            <p className="mt-1 text-lg font-semibold">{item.unit}</p>
          </div>
          <div className="rounded-2xl bg-[var(--surface)] px-4 py-3">
            <p className="text-xs text-[var(--muted-foreground)]">首选平台</p>
            <p className="mt-1 text-lg font-semibold">{item.preferredPlatform || "还没设置"}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href={`/items/${item.id}/records/new`}
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-[var(--primary)] px-4 text-sm font-medium text-white"
          >
            添加购买记录
          </Link>
          <Link
            href={`/items/${item.id}/edit`}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-medium text-[var(--foreground)]"
          >
            编辑物品
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
