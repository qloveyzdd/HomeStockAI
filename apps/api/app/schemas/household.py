from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class HouseholdBase(BaseModel):
    household_size: int = Field(ge=1, le=10)
    has_pet: bool = False
    pet_type: str | None = None
    has_baby: bool = False
    storage_level: Literal["small", "medium", "large"] = "medium"
    price_sensitivity: Literal["low", "medium", "high"] = "medium"
    stock_style: Literal["light", "normal", "heavy"] = "normal"
    preferred_platforms: list[str] | None = None
    reminder_tolerance: Literal["low", "medium", "high"] | None = None


class HouseholdCreate(HouseholdBase):
    pass


class HouseholdUpdate(HouseholdBase):
    pass


class HouseholdResponse(HouseholdBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    owner_account_id: str
