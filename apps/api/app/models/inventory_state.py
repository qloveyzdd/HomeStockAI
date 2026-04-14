from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from uuid import uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class InventoryState(Base):
    __tablename__ = "inventory_states"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    household_item_id: Mapped[str] = mapped_column(
        ForeignKey("household_items.id"), unique=True, index=True
    )
    estimated_remaining_qty: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    estimated_remaining_days: Mapped[int] = mapped_column()
    daily_consumption_rate: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    confidence_score: Mapped[Decimal] = mapped_column(Numeric(3, 2))
    below_safety_stock: Mapped[bool] = mapped_column(Boolean, default=False)
    calc_reason: Mapped[str] = mapped_column(Text)
    last_recalc_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    item: Mapped["HouseholdItem"] = relationship(back_populates="inventory_state")
