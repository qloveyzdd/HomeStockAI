export type PurchaseRecordSource = "manual" | "paste";

export type PurchaseRecordFormValues = {
  householdItemId: string;
  quantity: string;
  totalPrice: string;
  purchasedAt: string;
  platform: string;
  skuTitle?: string;
  rawText?: string;
  source?: PurchaseRecordSource;
};

export type PurchaseRecordSummary = {
  id: string;
  householdItemId: string;
  platform: string;
  skuTitle: string | null;
  quantity: number;
  totalPrice: number;
  unitPrice: number | null;
  purchasedAt: string;
  source: PurchaseRecordSource;
  createdAt: string;
};

export type ParseOrderTextRequest = {
  text: string;
};

export type ParseOrderTextCandidate = {
  platform: string | null;
  skuTitle: string | null;
  quantity: number | null;
  totalPrice: number | null;
};
