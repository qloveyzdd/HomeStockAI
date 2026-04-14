import Link from "next/link";

import type { HouseholdItemDetail, InventoryState } from "@refillwise/shared-types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function getConfidenceText(confidenceScore: number) {
  if (confidenceScore <= 0.35) return "估算中";
  if (confidenceScore <= 0.6) return "参考性一般";
  return "相对稳定";
}

export function InventoryStatusCard({
  item,
  inventoryState,
}: {
  item: HouseholdItemDetail;
  inventoryState: InventoryState | null;
}) {
  if (!inventoryState) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>库存状态</CardTitle>
          <CardDescription>先记下第一次购买，系统才会开始估算剩余天数。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl bg-[var(--surface)] px-4 py-4 text-sm text-[var(--muted-foreground)]">
            当前安全库存是 {item.safetyStockDays} 天。记下第一条购买记录后，这里就会开始显示“估算中”。
          </div>
          <Link
            href={`/items/${item.id}/records/new`}
            className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-[var(--primary)] px-4 text-sm font-medium text-white"
          >
            先记下第一次购买
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>库存状态</CardTitle>
        <CardDescription>这一版先用购买记录做 baseline，结果会随着记录变多越来越稳。</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-[var(--surface)] px-4 py-4">
            <p className="text-xs text-[var(--muted-foreground)]">预计剩余</p>
            <p className="mt-1 text-2xl font-bold">{inventoryState.estimatedRemainingDays} 天</p>
          </div>
          <div className="rounded-2xl bg-[var(--surface)] px-4 py-4">
            <p className="text-xs text-[var(--muted-foreground)]">日均消耗</p>
            <p className="mt-1 text-2xl font-bold">{inventoryState.dailyConsumptionRate.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl bg-[var(--surface)] px-4 py-4">
            <p className="text-xs text-[var(--muted-foreground)]">估算可信度</p>
            <p className="mt-1 text-2xl font-bold">{getConfidenceText(inventoryState.confidenceScore)}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] px-4 py-4">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-[var(--muted-foreground)]">安全库存</span>
            <span className="font-medium">{item.safetyStockDays} 天</span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-sm">
            <span className="text-[var(--muted-foreground)]">当前判断</span>
            <span className={inventoryState.belowSafetyStock ? "font-medium text-[var(--destructive)]" : "font-medium text-[var(--primary)]"}>
              {inventoryState.belowSafetyStock ? "低于安全库存" : "库存还在安全线内"}
            </span>
          </div>
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">{inventoryState.calcReason}</p>
        </div>
      </CardContent>
    </Card>
  );
}
