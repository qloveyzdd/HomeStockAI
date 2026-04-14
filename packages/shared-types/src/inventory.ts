export type InventoryStatus = "estimated" | "estimating" | "low_stock" | "no_records";

export type InventoryState = {
  id: string;
  householdItemId: string;
  estimatedRemainingQty: number;
  estimatedRemainingDays: number;
  dailyConsumptionRate: number;
  confidenceScore: number;
  belowSafetyStock: boolean;
  calcReason: string;
  lastRecalcAt: string;
};

export type ItemInventorySummary = {
  estimatedRemainingDays: number | null;
  inventoryStatus: InventoryStatus;
  lastPurchasedAt: string | null;
};
