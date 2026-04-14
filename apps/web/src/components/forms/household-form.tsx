"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { HouseholdFormValues } from "@refillwise/shared-types";

import { PrimaryActionBar } from "@/components/primary-action-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api-client";
import { cn } from "@/lib/utils";

type HouseholdApiPayload = {
  id: string;
  owner_account_id: string;
  household_size: number;
  has_pet: boolean;
  pet_type: string | null;
  has_baby: boolean;
  storage_level: HouseholdFormValues["storageLevel"];
  price_sensitivity: HouseholdFormValues["priceSensitivity"];
  stock_style: HouseholdFormValues["stockStyle"];
  preferred_platforms: string[] | null;
  reminder_tolerance: HouseholdFormValues["reminderTolerance"] | null;
};

const storageOptions: Array<{ label: string; value: HouseholdFormValues["storageLevel"] }> = [
  { label: "空间小", value: "small" },
  { label: "刚刚好", value: "medium" },
  { label: "空间大", value: "large" },
];

const priceOptions: Array<{ label: string; value: HouseholdFormValues["priceSensitivity"] }> = [
  { label: "不太比价", value: "low" },
  { label: "看性价比", value: "medium" },
  { label: "很在意价格", value: "high" },
];

const stockOptions: Array<{ label: string; value: HouseholdFormValues["stockStyle"] }> = [
  { label: "轻囤货", value: "light" },
  { label: "正常囤货", value: "normal" },
  { label: "重囤货", value: "heavy" },
];

const reminderOptions = [
  { label: "少提醒", value: "low" },
  { label: "正常", value: "medium" },
  { label: "可以多提醒", value: "high" },
] as const;

function ChoiceGroup<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (next: T) => void;
  options: Array<{ label: string; value: T }>;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cn(
            "rounded-2xl border px-3 py-3 text-sm font-medium",
            value === option.value
              ? "border-[var(--primary)] bg-[var(--primary)] text-white"
              : "border-[var(--border)] bg-white text-[var(--foreground)]",
          )}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function HouseholdForm({
  mode,
  householdId,
  initialValue,
}: {
  mode: "create" | "edit";
  householdId?: string;
  initialValue?: HouseholdApiPayload | null;
}) {
  const router = useRouter();
  const defaults = useMemo<HouseholdFormValues>(
    () => ({
      householdSize: initialValue?.household_size ?? 2,
      hasPet: initialValue?.has_pet ?? false,
      petType: initialValue?.pet_type ?? "",
      hasBaby: initialValue?.has_baby ?? false,
      storageLevel: initialValue?.storage_level ?? "medium",
      priceSensitivity: initialValue?.price_sensitivity ?? "medium",
      stockStyle: initialValue?.stock_style ?? "normal",
      preferredPlatforms: initialValue?.preferred_platforms ?? [],
      reminderTolerance: initialValue?.reminder_tolerance ?? "medium",
    }),
    [initialValue],
  );

  const [form, setForm] = useState<HouseholdFormValues>(defaults);
  const [preferredPlatformsText, setPreferredPlatformsText] = useState(
    defaults.preferredPlatforms?.join("、") ?? "",
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const payload = {
        household_size: form.householdSize,
        has_pet: form.hasPet,
        pet_type: form.hasPet ? form.petType || null : null,
        has_baby: form.hasBaby,
        storage_level: form.storageLevel,
        price_sensitivity: form.priceSensitivity,
        stock_style: form.stockStyle,
        preferred_platforms: preferredPlatformsText
          ? preferredPlatformsText.split(/[、,，]/).map((item) => item.trim()).filter(Boolean)
          : [],
        reminder_tolerance: form.reminderTolerance ?? null,
      };

      if (mode === "create") {
        await apiFetch("/household", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        router.push("/items");
        router.refresh();
        return;
      }

      await apiFetch(`/household/${householdId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "这次没保存成功，请重试");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? "先了解一下你家" : "家庭信息"}</CardTitle>
          <CardDescription>先把最关键的信息填好，后面补货判断才有依据。</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="householdSize">家庭人数</Label>
            <Input
              id="householdSize"
              inputMode="numeric"
              min={1}
              max={10}
              value={form.householdSize}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  householdSize: Number(event.target.value || 1),
                }))
              }
            />
          </div>

          <div className="space-y-3">
            <Label>是否有宠物</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={form.hasPet ? "default" : "outline"}
                onClick={() => setForm((current) => ({ ...current, hasPet: true }))}
              >
                有宠物
              </Button>
              <Button
                type="button"
                variant={!form.hasPet ? "default" : "outline"}
                onClick={() => setForm((current) => ({ ...current, hasPet: false, petType: "" }))}
              >
                没有宠物
              </Button>
            </div>
          </div>

          {form.hasPet ? (
            <div>
              <Label htmlFor="petType">宠物类型</Label>
              <Input
                id="petType"
                placeholder="例如：猫、狗"
                value={form.petType}
                onChange={(event) => setForm((current) => ({ ...current, petType: event.target.value }))}
              />
            </div>
          ) : null}

          <div className="space-y-3">
            <Label>是否有婴幼儿</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={form.hasBaby ? "default" : "outline"}
                onClick={() => setForm((current) => ({ ...current, hasBaby: true }))}
              >
                有
              </Button>
              <Button
                type="button"
                variant={!form.hasBaby ? "default" : "outline"}
                onClick={() => setForm((current) => ({ ...current, hasBaby: false }))}
              >
                没有
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label>储物空间等级</Label>
            <ChoiceGroup value={form.storageLevel} onChange={(value) => setForm((current) => ({ ...current, storageLevel: value }))} options={storageOptions} />
          </div>

          <div className="space-y-3">
            <Label>价格敏感度</Label>
            <ChoiceGroup value={form.priceSensitivity} onChange={(value) => setForm((current) => ({ ...current, priceSensitivity: value }))} options={priceOptions} />
          </div>

          <div className="space-y-3">
            <Label>囤货偏好</Label>
            <ChoiceGroup value={form.stockStyle} onChange={(value) => setForm((current) => ({ ...current, stockStyle: value }))} options={stockOptions} />
          </div>

          <details className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
            <summary className="cursor-pointer text-sm font-medium text-[var(--foreground)]">补充设置</summary>
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="preferredPlatforms">常购平台</Label>
                <Input
                  id="preferredPlatforms"
                  placeholder="例如：京东、淘宝、盒马"
                  value={preferredPlatformsText}
                  onChange={(event) => setPreferredPlatformsText(event.target.value)}
                />
              </div>
              <div className="space-y-3">
                <Label>提醒容忍度</Label>
                <ChoiceGroup
                  value={form.reminderTolerance ?? "medium"}
                  onChange={(value) => setForm((current) => ({ ...current, reminderTolerance: value }))}
                  options={reminderOptions.map((option) => ({ ...option }))}
                />
              </div>
            </div>
          </details>

          {error ? <p className="text-sm text-[var(--destructive)]">{error}</p> : null}
        </CardContent>
      </Card>

      <PrimaryActionBar label={mode === "create" ? "保存并添加物品" : "保存并继续"} type="submit" disabled={pending} />
    </form>
  );
}
