from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class PurchaseRecordCreate(BaseModel):
    household_item_id: str
    quantity: float = Field(gt=0)
    total_price: float = Field(gt=0)
    purchased_at: datetime
    platform: str = Field(min_length=1, max_length=50)
    sku_title: str | None = Field(default=None, max_length=200)
    source: Literal["manual", "paste"] = "manual"
    raw_text: str | None = Field(default=None, max_length=4000)


class PurchaseRecordSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    household_item_id: str
    platform: str
    sku_title: str | None
    quantity: float
    total_price: float
    unit_price: float | None
    purchased_at: datetime
    source: Literal["manual", "paste"]
    created_at: datetime


class ParseOrderTextRequest(BaseModel):
    text: str = Field(min_length=1, max_length=4000)


class ParseOrderTextCandidate(BaseModel):
    platform: str | None = None
    sku_title: str | None = None
    quantity: float | None = None
    total_price: float | None = None
