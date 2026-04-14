export type StorageLevel = "small" | "medium" | "large";
export type PriceSensitivity = "low" | "medium" | "high";
export type StockStyle = "light" | "normal" | "heavy";

export type HouseholdFormValues = {
  householdSize: number;
  hasPet: boolean;
  petType: string;
  hasBaby: boolean;
  storageLevel: StorageLevel;
  priceSensitivity: PriceSensitivity;
  stockStyle: StockStyle;
  preferredPlatforms?: string[];
  reminderTolerance?: "low" | "medium" | "high";
};
