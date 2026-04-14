import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyStateCard() {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>先把家里常买的加进来</CardTitle>
        <CardDescription>
          先添加 1 到 3 个常用消耗品，后面才能继续做库存和补货判断。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href="/items/new"
          className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-[var(--primary)] px-4 text-sm font-medium text-white"
        >
          添加物品
        </Link>
      </CardContent>
    </Card>
  );
}
