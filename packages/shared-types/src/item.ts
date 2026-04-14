import type { InventoryStatus } from "./inventory";

export const SUPPORTED_ITEM_CATEGORIES = [
  "卷纸",
  "抽纸",
  "垃圾袋",
  "洗衣液",
  "洗洁精",
  "牙膏",
  "猫粮",
  "狗粮",
  "猫砂",
  "尿不湿",
  "湿巾",
] as const;

export type SupportedItemCategory = (typeof SUPPORTED_ITEM_CATEGORIES)[number];

export type HouseholdItemFormValues = {
  name: string;
  category: SupportedItemCategory | string;
  brand: string;
  specText: string;
  unit: string;
  safetyStockDays?: number;
  preferredPlatform?: string;
  replaceable?: boolean;
  enabled?: boolean;
  isCustom?: boolean;
};

export type HouseholdItemSummary = {
  id: string;
  name: string;
  category: SupportedItemCategory | string;
  brand: string;
  specText: string;
  enabled: boolean;
  isCustom: boolean;
  estimatedRemainingDays: number | null;
  inventoryStatus: InventoryStatus;
  lastPurchasedAt: string | null;
};

export type HouseholdItemDetail = HouseholdItemSummary & {
  householdId: string;
  unit: string;
  safetyStockDays: number;
  preferredPlatform: string | null;
  replaceable: boolean;
};
