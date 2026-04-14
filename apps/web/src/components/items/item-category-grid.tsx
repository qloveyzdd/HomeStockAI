import { cn } from "@/lib/utils";

export function ItemCategoryGrid({
  categories,
  selected,
  onSelect,
}: {
  categories: Array<{ category: string; unit: string; safety_stock_days: number }>;
  selected: string;
  onSelect: (category: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {categories.map((item) => {
        const isSelected = item.category === selected;
        return (
          <button
            key={item.category}
            type="button"
            className={cn(
              "rounded-2xl border px-4 py-4 text-left",
              isSelected ? "border-[var(--primary)] bg-white" : "border-[var(--border)] bg-white/70",
            )}
            onClick={() => onSelect(item.category)}
          >
            <p className="text-sm font-medium text-[var(--foreground)]">{item.category}</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              默认单位 {item.unit} · 安全库存 {item.safety_stock_days} 天
            </p>
          </button>
        );
      })}
    </div>
  );
}
