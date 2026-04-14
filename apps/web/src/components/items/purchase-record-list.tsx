import type { PurchaseRecordSummary } from "@refillwise/shared-types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-CN", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function PurchaseRecordList({
  records,
  unit,
}: {
  records: PurchaseRecordSummary[];
  unit: string;
}) {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>购买记录</CardTitle>
        <CardDescription>最近的购买会直接影响库存估算结果。</CardDescription>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <div className="rounded-2xl bg-[var(--surface)] px-4 py-4 text-sm text-[var(--muted-foreground)]">
            先记下第一次购买，系统才知道该从哪里开始估算。
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div key={record.id} className="rounded-2xl border border-[var(--border)] px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {record.skuTitle || `${record.platform} 购买记录`}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">{record.platform}</p>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)]">{formatDate(record.purchasedAt)}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-[var(--muted-foreground)]">
                  <span>数量 {formatNumber(record.quantity)} {unit}</span>
                  <span>总价 ¥{formatNumber(record.totalPrice)}</span>
                  <span>单价 ¥{formatNumber(record.unitPrice ?? 0)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
