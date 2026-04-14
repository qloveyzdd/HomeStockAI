import Link from "next/link";

import type { HouseholdItemSummary } from "@refillwise/shared-types";

import { Card, CardContent } from "@/components/ui/card";

export function ItemSummaryCard({ item }: { item: HouseholdItemSummary }) {
  return (
    <Link href={`/items/${item.id}/edit`}>
      <Card className="bg-white">
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-[var(--foreground)]">{item.name}</h2>
              <p className="text-sm text-[var(--muted-foreground)]">{item.category}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${item.enabled ? "bg-[var(--surface)] text-[var(--primary)]" : "bg-[#f8e3df] text-[var(--destructive)]"}`}>
              {item.enabled ? "启用中" : "已停用"}
            </span>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            {item.brand || "未填写品牌"} · {item.specText || "未填写规格"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
