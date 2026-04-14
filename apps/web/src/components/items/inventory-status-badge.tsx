import type { InventoryStatus } from "@refillwise/shared-types";

import { cn } from "@/lib/utils";

function getStatusCopy(status: InventoryStatus, estimatedRemainingDays: number | null) {
  switch (status) {
    case "low_stock":
      return "低于安全库存";
    case "estimating":
      return "估算中";
    case "no_records":
      return "还没有记录";
    default:
      return estimatedRemainingDays !== null ? `预计剩余 ${estimatedRemainingDays} 天` : "预计剩余 --";
  }
}

export function InventoryStatusBadge({
  status,
  estimatedRemainingDays,
}: {
  status: InventoryStatus;
  estimatedRemainingDays: number | null;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-medium",
        status === "low_stock" && "bg-[#f8e3df] text-[var(--destructive)]",
        status === "estimating" && "bg-[#efe8da] text-[var(--foreground)]",
        status === "no_records" && "bg-white text-[var(--muted-foreground)]",
        status === "estimated" && "bg-[var(--surface)] text-[var(--primary)]",
      )}
    >
      {getStatusCopy(status, estimatedRemainingDays)}
    </span>
  );
}
