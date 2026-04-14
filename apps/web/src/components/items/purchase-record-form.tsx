"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { HouseholdItemDetail, ParseOrderTextCandidate, PurchaseRecordFormValues } from "@refillwise/shared-types";

import { PrimaryActionBar } from "@/components/primary-action-bar";
import { ParseOrderTextCard } from "@/components/items/parse-order-text-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api-client";

const PLATFORM_OPTIONS = ["京东", "淘宝", "天猫", "拼多多", "抖音"];
const CUSTOM_PLATFORM_VALUE = "__custom__";

function todayValue() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export function PurchaseRecordForm({ item }: { item: HouseholdItemDetail }) {
  const router = useRouter();
  const prefersCustomPlatform = item.preferredPlatform
    ? !PLATFORM_OPTIONS.includes(item.preferredPlatform)
    : false;

  const initialForm = useMemo<PurchaseRecordFormValues>(
    () => ({
      householdItemId: item.id,
      quantity: "",
      totalPrice: "",
      purchasedAt: todayValue(),
      platform: prefersCustomPlatform ? "" : (item.preferredPlatform ?? PLATFORM_OPTIONS[0]),
      skuTitle: "",
      rawText: "",
      source: "manual",
    }),
    [item.id, item.preferredPlatform, prefersCustomPlatform],
  );

  const [form, setForm] = useState(initialForm);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [customPlatform, setCustomPlatform] = useState(prefersCustomPlatform ? (item.preferredPlatform ?? "") : "");
  const [useCustomPlatform, setUseCustomPlatform] = useState(prefersCustomPlatform);

  function updateFromParsed(candidate: ParseOrderTextCandidate, rawText: string) {
    setForm((current) => ({
      ...current,
      quantity: candidate.quantity !== null ? String(candidate.quantity) : current.quantity,
      totalPrice: candidate.totalPrice !== null ? String(candidate.totalPrice) : current.totalPrice,
      skuTitle: candidate.skuTitle ?? current.skuTitle,
      rawText,
      source: "paste",
    }));

    if (candidate.platform) {
      if (PLATFORM_OPTIONS.includes(candidate.platform)) {
        setUseCustomPlatform(false);
        setCustomPlatform("");
        setForm((current) => ({ ...current, platform: candidate.platform ?? current.platform }));
      } else {
        setUseCustomPlatform(true);
        setCustomPlatform(candidate.platform);
      }
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const platform = (useCustomPlatform ? customPlatform : form.platform).trim();
    if (!platform) {
      setError("先选一个购买平台。");
      setPending(false);
      return;
    }

    try {
      await apiFetch("/purchase-records", {
        method: "POST",
        body: JSON.stringify({
          household_item_id: item.id,
          quantity: Number(form.quantity),
          total_price: Number(form.totalPrice),
          purchased_at: `${form.purchasedAt}T12:00:00`,
          platform,
          sku_title: form.skuTitle || null,
          raw_text: form.rawText || null,
          source: form.source ?? "manual",
        }),
      });
      router.push(`/items/${item.id}`);
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "这次没保存成功，请重试");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ParseOrderTextCard onFill={updateFromParsed} />

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>手动录入</CardTitle>
          <CardDescription>这一步先只记最关键的 5 个字段，越简单越容易坚持。</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="item-name">物品</Label>
            <Input id="item-name" value={`${item.name} · ${item.category}`} readOnly />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">购买数量</Label>
              <Input
                id="quantity"
                inputMode="decimal"
                placeholder={`例如：2 ${item.unit}`}
                value={form.quantity}
                onChange={(event) =>
                  setForm((current) => ({ ...current, quantity: event.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="total-price">总价</Label>
              <Input
                id="total-price"
                inputMode="decimal"
                placeholder="例如：59"
                value={form.totalPrice}
                onChange={(event) =>
                  setForm((current) => ({ ...current, totalPrice: event.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="purchased-at">购买日期</Label>
            <Input
              id="purchased-at"
              type="date"
              value={form.purchasedAt}
              onChange={(event) => setForm((current) => ({ ...current, purchasedAt: event.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="platform">平台</Label>
            <select
              id="platform"
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none"
              value={useCustomPlatform ? CUSTOM_PLATFORM_VALUE : form.platform}
              onChange={(event) => {
                const nextValue = event.target.value;
                if (nextValue === CUSTOM_PLATFORM_VALUE) {
                  setUseCustomPlatform(true);
                  return;
                }
                setUseCustomPlatform(false);
                setForm((current) => ({ ...current, platform: nextValue }));
              }}
            >
              <option value="">请选择平台</option>
              {PLATFORM_OPTIONS.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
              <option value={CUSTOM_PLATFORM_VALUE}>自定义平台</option>
            </select>
          </div>

          {useCustomPlatform ? (
            <div>
              <Label htmlFor="custom-platform">自定义平台</Label>
              <Input
                id="custom-platform"
                placeholder="例如：京东到家"
                value={customPlatform}
                onChange={(event) => setCustomPlatform(event.target.value)}
              />
            </div>
          ) : null}

          <details className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
            <summary className="cursor-pointer text-sm font-medium text-[var(--foreground)]">补充信息（选填）</summary>
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="sku-title">订单标题</Label>
                <Input
                  id="sku-title"
                  placeholder="例如：维达卷纸 4 提"
                  value={form.skuTitle ?? ""}
                  onChange={(event) => setForm((current) => ({ ...current, skuTitle: event.target.value }))}
                />
              </div>
            </div>
          </details>

          {error ? <p className="text-sm text-[var(--destructive)]">{error}</p> : null}
        </CardContent>
      </Card>

      <PrimaryActionBar
        label="保存这次购买"
        type="submit"
        disabled={pending}
        secondaryAction={
          <Button type="button" variant="outline" onClick={() => router.push(`/items/${item.id}`)}>
            返回物品详情
          </Button>
        }
      />
    </form>
  );
}
