import type {
  AuthSessionResponse,
  HouseholdItemDetail,
  HouseholdItemSummary,
  InventoryState,
  InventoryStatus,
  ParseOrderTextCandidate,
  PurchaseRecordSummary,
} from "@refillwise/shared-types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

export type HouseholdItemApiResponse = {
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
  estimated_remaining_days: number | null;
  inventory_status: InventoryStatus;
  last_purchased_at: string | null;
};

export type InventoryStateApiResponse = {
  id: string;
  household_item_id: string;
  estimated_remaining_qty: number;
  estimated_remaining_days: number;
  daily_consumption_rate: number;
  confidence_score: number;
  below_safety_stock: boolean;
  calc_reason: string;
  last_recalc_at: string;
};

export type PurchaseRecordApiResponse = {
  id: string;
  household_item_id: string;
  platform: string;
  sku_title: string | null;
  quantity: number;
  total_price: number;
  unit_price: number | null;
  purchased_at: string;
  source: "manual" | "paste";
  created_at: string;
};

export type ParseOrderTextCandidateApiResponse = {
  platform: string | null;
  sku_title: string | null;
  quantity: number | null;
  total_price: number | null;
};

export function buildApiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    cache: "no-store",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.detail ?? "请求失败");
  }

  return response.json() as Promise<T>;
}

export function normalizeSessionResponse(payload: {
  account: AuthSessionResponse["account"];
  household_id: string | null;
  setup_completed: boolean;
}): AuthSessionResponse {
  return {
    account: payload.account,
    householdId: payload.household_id,
    setupCompleted: payload.setup_completed,
  };
}

export function normalizeHouseholdItem(payload: HouseholdItemApiResponse): HouseholdItemDetail {
  return {
    id: payload.id,
    householdId: payload.household_id,
    name: payload.name,
    category: payload.category,
    brand: payload.brand ?? "",
    specText: payload.spec_text ?? "",
    unit: payload.unit,
    safetyStockDays: payload.safety_stock_days,
    preferredPlatform: payload.preferred_platform,
    replaceable: payload.replaceable,
    enabled: payload.enabled,
    isCustom: payload.is_custom,
    estimatedRemainingDays: payload.estimated_remaining_days,
    inventoryStatus: payload.inventory_status,
    lastPurchasedAt: payload.last_purchased_at,
  };
}

export function normalizeHouseholdItems(payload: HouseholdItemApiResponse[]): HouseholdItemSummary[] {
  return payload.map(normalizeHouseholdItem);
}

export function normalizeInventoryState(payload: InventoryStateApiResponse): InventoryState {
  return {
    id: payload.id,
    householdItemId: payload.household_item_id,
    estimatedRemainingQty: payload.estimated_remaining_qty,
    estimatedRemainingDays: payload.estimated_remaining_days,
    dailyConsumptionRate: payload.daily_consumption_rate,
    confidenceScore: payload.confidence_score,
    belowSafetyStock: payload.below_safety_stock,
    calcReason: payload.calc_reason,
    lastRecalcAt: payload.last_recalc_at,
  };
}

export function normalizePurchaseRecord(payload: PurchaseRecordApiResponse): PurchaseRecordSummary {
  return {
    id: payload.id,
    householdItemId: payload.household_item_id,
    platform: payload.platform,
    skuTitle: payload.sku_title,
    quantity: payload.quantity,
    totalPrice: payload.total_price,
    unitPrice: payload.unit_price,
    purchasedAt: payload.purchased_at,
    source: payload.source,
    createdAt: payload.created_at,
  };
}

export function normalizePurchaseRecords(payload: PurchaseRecordApiResponse[]): PurchaseRecordSummary[] {
  return payload.map(normalizePurchaseRecord);
}

export function normalizeParseOrderTextCandidate(
  payload: ParseOrderTextCandidateApiResponse,
): ParseOrderTextCandidate {
  return {
    platform: payload.platform,
    skuTitle: payload.sku_title,
    quantity: payload.quantity,
    totalPrice: payload.total_price,
  };
}
