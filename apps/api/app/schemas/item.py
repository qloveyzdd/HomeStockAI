from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class ItemCatalogEntry(BaseModel):
    category: str
    unit: str
    safety_stock_days: int


class HouseholdItemBase(BaseModel):
    name: str | None = None
    category: str
    brand: str | None = None
    spec_text: str | None = None
    unit: str | None = None
    safety_stock_days: int | None = Field(default=None, ge=1, le=30)
    preferred_platform: str | None = None
    replaceable: bool = False
    enabled: bool = True
    is_custom: bool = False


class HouseholdItemCreate(HouseholdItemBase):
    pass


class HouseholdItemUpdate(HouseholdItemBase):
    pass


class HouseholdItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    household_id: str
    name: str
    category: str
    brand: str | None
    spec_text: str | None
    unit: str
    safety_stock_days: int
    preferred_platform: str | None
    replaceable: bool
    enabled: bool
    is_custom: bool
    estimated_remaining_days: int | None = None
    inventory_status: Literal["estimated", "estimating", "low_stock", "no_records"] = "no_records"
    last_purchased_at: datetime | None = None
