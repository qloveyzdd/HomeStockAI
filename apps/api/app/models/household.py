from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Household(Base):
    __tablename__ = "households"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    owner_account_id: Mapped[str] = mapped_column(ForeignKey("accounts.id"), unique=True, index=True)
    household_size: Mapped[int] = mapped_column(default=1)
    has_pet: Mapped[bool] = mapped_column(Boolean, default=False)
    pet_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    has_baby: Mapped[bool] = mapped_column(Boolean, default=False)
    storage_level: Mapped[str] = mapped_column(String(20), default="medium")
    price_sensitivity: Mapped[str] = mapped_column(String(20), default="medium")
    stock_style: Mapped[str] = mapped_column(String(20), default="normal")
    preferred_platforms: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    reminder_tolerance: Mapped[str | None] = mapped_column(String(20), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    owner: Mapped["Account"] = relationship(back_populates="household")
    items: Mapped[list["HouseholdItem"]] = relationship(back_populates="household")
