"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PrimaryActionBar } from "@/components/primary-action-bar";
import { ItemCategoryGrid } from "@/components/items/item-category-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api-client";

type CatalogEntry = {
  category: string;
  unit: string;
  safety_stock_days: number;
};

type ItemPayload = {
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
};

export function ItemForm({
  mode,
  catalog,
  initialItem,
}: {
  mode: "create" | "edit";
  catalog: CatalogEntry[];
  initialItem?: ItemPayload;
}) {
  const router = useRouter();
  const defaultCatalog = catalog[0];
  const defaults = useMemo(
    () => ({
      category: initialItem?.category ?? defaultCatalog?.category ?? "卷纸",
      brand: initialItem?.brand ?? "",
      specText: initialItem?.spec_text ?? "",
      unit: initialItem?.unit ?? defaultCatalog?.unit ?? "件",
      safetyStockDays: initialItem?.safety_stock_days ?? defaultCatalog?.safety_stock_days ?? 7,
      preferredPlatform: initialItem?.preferred_platform ?? "",
      replaceable: initialItem?.replaceable ?? false,
      enabled: initialItem?.enabled ?? true,
      isCustom: initialItem?.is_custom ?? false,
      name: initialItem?.name ?? "",
    }),
    [catalog, defaultCatalog, initialItem],
  );

  const [form, setForm] = useState(defaults);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  function applyCatalog(category: string) {
    const matched = catalog.find((item) => item.category === category);
    setForm((current) => ({
      ...current,
      category,
      name: current.isCustom ? current.name : category,
      unit: matched?.unit ?? current.unit,
      safetyStockDays: matched?.safety_stock_days ?? current.safetyStockDays,
    }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const payload = {
      name: form.isCustom ? form.name : form.category,
      category: form.category,
      brand: form.brand || null,
      spec_text: form.specText || null,
      unit: form.unit,
      safety_stock_days: form.safetyStockDays,
      preferred_platform: form.preferredPlatform || null,
      replaceable: form.replaceable,
      enabled: form.enabled,
      is_custom: form.isCustom,
    };

    try {
      if (mode === "create") {
        await apiFetch("/items", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch(`/items/${initialItem?.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      }
      router.push("/items");
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "这次没保存成功，请重试");
    } finally {
      setPending(false);
    }
  }

  async function toggleEnabled(nextEnabled: boolean) {
    if (!initialItem) return;
    setPending(true);
    setError("");
    try {
      await apiFetch(`/items/${initialItem.id}/${nextEnabled ? "enable" : "disable"}`, {
        method: "POST",
      });
      router.push("/items");
      router.refresh();
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "状态更新失败");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? "选一个常用品类" : "编辑追踪物品"}</CardTitle>
          <CardDescription>先选预设品类，再把品牌和规格补上。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Button
              type="button"
              variant={!form.isCustom ? "default" : "outline"}
              className="w-auto px-4"
              onClick={() => setForm((current) => ({ ...current, isCustom: false, name: current.category }))}
            >
              预设品类
            </Button>
            <Button
              type="button"
              variant={form.isCustom ? "default" : "outline"}
              className="w-auto px-4"
              onClick={() => setForm((current) => ({ ...current, isCustom: true, name: current.name || "" }))}
            >
              自定义物品
            </Button>
          </div>

          {!form.isCustom ? (
            <ItemCategoryGrid categories={catalog} selected={form.category} onSelect={applyCatalog} />
          ) : (
            <div>
              <Label htmlFor="name">物品名称</Label>
              <Input
                id="name"
                placeholder="例如：厨房纸"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              />
            </div>
          )}

          <div>
            <Label htmlFor="brand">品牌</Label>
            <Input
              id="brand"
              placeholder="例如：维达"
              value={form.brand}
              onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="specText">规格</Label>
            <Input
              id="specText"
              placeholder="例如：24 卷 / 4kg / 200 抽"
              value={form.specText}
              onChange={(event) => setForm((current) => ({ ...current, specText: event.target.value }))}
            />
          </div>

          <details className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
            <summary className="cursor-pointer text-sm font-medium text-[var(--foreground)]">更多设置</summary>
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="unit">单位</Label>
                <Input
                  id="unit"
                  value={form.unit}
                  onChange={(event) => setForm((current) => ({ ...current, unit: event.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="safetyStockDays">安全库存天数</Label>
                <Input
                  id="safetyStockDays"
                  inputMode="numeric"
                  value={form.safetyStockDays}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      safetyStockDays: Number(event.target.value || 1),
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="preferredPlatform">首选平台</Label>
                <Input
                  id="preferredPlatform"
                  placeholder="例如：京东自营"
                  value={form.preferredPlatform}
                  onChange={(event) => setForm((current) => ({ ...current, preferredPlatform: event.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={form.replaceable ? "default" : "outline"}
                  onClick={() => setForm((current) => ({ ...current, replaceable: true }))}
                >
                  接受平替
                </Button>
                <Button
                  type="button"
                  variant={!form.replaceable ? "default" : "outline"}
                  onClick={() => setForm((current) => ({ ...current, replaceable: false }))}
                >
                  只买原品牌
                </Button>
              </div>
            </div>
          </details>

          {error ? <p className="text-sm text-[var(--destructive)]">{error}</p> : null}
        </CardContent>
      </Card>

      <PrimaryActionBar
        label="保存物品"
        type="submit"
        disabled={pending}
        secondaryAction={
          mode === "edit" ? (
            <Button
              type="button"
              variant={initialItem?.enabled ? "outline" : "destructive"}
              onClick={() => toggleEnabled(!(initialItem?.enabled ?? true))}
            >
              {initialItem?.enabled ? "停用追踪" : "重新启用"}
            </Button>
          ) : null
        }
      />
    </form>
  );
}
