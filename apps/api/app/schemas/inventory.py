from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class InventoryStateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    household_item_id: str
    estimated_remaining_qty: float
    estimated_remaining_days: int
    daily_consumption_rate: float
    confidence_score: float
    below_safety_stock: bool
    calc_reason: str
    last_recalc_at: datetime
