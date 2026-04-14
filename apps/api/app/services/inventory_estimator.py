from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from math import floor

from sqlalchemy.orm import Session

from app.domain.inventory_defaults import get_adjusted_cycle_days
from app.models.household import Household
from app.models.household_item import HouseholdItem
from app.models.inventory_state import InventoryState
from app.models.purchase_record import PurchaseRecord

CONFIDENCE_SINGLE = Decimal("0.35")
CONFIDENCE_DOUBLE = Decimal("0.60")
CONFIDENCE_MULTI = Decimal("0.80")


def _quantize(value: float) -> Decimal:
    return Decimal(str(max(value, 0))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def _days_between(later: datetime, earlier: datetime) -> int:
    later_utc = later.astimezone(timezone.utc) if later.tzinfo else later.replace(tzinfo=timezone.utc)
    earlier_utc = earlier.astimezone(timezone.utc) if earlier.tzinfo else earlier.replace(tzinfo=timezone.utc)
    seconds = (later_utc - earlier_utc).total_seconds()
    return max(int(seconds // 86400), 0)


def _load_records(db: Session, item_id: str) -> list[PurchaseRecord]:
    return (
        db.query(PurchaseRecord)
        .filter(PurchaseRecord.household_item_id == item_id)
        .order_by(PurchaseRecord.purchased_at.asc(), PurchaseRecord.created_at.asc())
        .all()
    )


def _build_single_record_snapshot(record: PurchaseRecord, item: HouseholdItem, household: Household) -> dict[str, Decimal | int | bool | str | datetime]:
    adjusted_cycle_days = get_adjusted_cycle_days(
        item.category,
        household.household_size,
        household.has_pet,
        household.pet_type,
        household.has_baby,
    )
    quantity = float(record.quantity)
    daily_rate = quantity / adjusted_cycle_days
    days_since_last_purchase = _days_between(datetime.now(timezone.utc), record.purchased_at)
    estimated_remaining_qty = max(quantity - daily_rate * days_since_last_purchase, 0)
    estimated_remaining_days = floor(estimated_remaining_qty / daily_rate) if daily_rate > 0 else 0

    return {
        "estimated_remaining_qty": _quantize(estimated_remaining_qty),
        "estimated_remaining_days": estimated_remaining_days,
        "daily_consumption_rate": _quantize(daily_rate),
        "confidence_score": CONFIDENCE_SINGLE,
        "below_safety_stock": estimated_remaining_days < item.safety_stock_days,
        "calc_reason": f"1条记录，按默认周期 {adjusted_cycle_days:.1f} 天估算中",
        "last_recalc_at": datetime.now(timezone.utc),
    }


def _build_multi_record_snapshot(records: list[PurchaseRecord], item: HouseholdItem) -> dict[str, Decimal | int | bool | str | datetime]:
    interval_rates: list[float] = []
    weights: list[int] = []

    for index in range(1, len(records)):
        previous = records[index - 1]
        current = records[index]
        days_between = max(_days_between(current.purchased_at, previous.purchased_at), 1)
        interval_rate = float(previous.quantity) / days_between
        interval_rates.append(interval_rate)
        weights.append(index)

    weighted_sum = sum(rate * weight for rate, weight in zip(interval_rates, weights, strict=False))
    weight_total = sum(weights) or 1
    daily_rate = weighted_sum / weight_total
    last_record = records[-1]
    days_since_last_purchase = _days_between(datetime.now(timezone.utc), last_record.purchased_at)
    estimated_remaining_qty = max(float(last_record.quantity) - daily_rate * days_since_last_purchase, 0)
    estimated_remaining_days = floor(estimated_remaining_qty / daily_rate) if daily_rate > 0 else 0
    confidence_score = CONFIDENCE_DOUBLE if len(records) == 2 else CONFIDENCE_MULTI

    return {
        "estimated_remaining_qty": _quantize(estimated_remaining_qty),
        "estimated_remaining_days": estimated_remaining_days,
        "daily_consumption_rate": _quantize(daily_rate),
        "confidence_score": confidence_score,
        "below_safety_stock": estimated_remaining_days < item.safety_stock_days,
        "calc_reason": f"{len(records)}条记录，按最近{len(interval_rates)}个购买间隔估算",
        "last_recalc_at": datetime.now(timezone.utc),
    }


def recalculate_inventory_state(db: Session, item: HouseholdItem, household: Household) -> InventoryState | None:
    records = _load_records(db, item.id)
    current_state = (
        db.query(InventoryState)
        .filter(InventoryState.household_item_id == item.id)
        .first()
    )

    if not records:
        if current_state is not None:
            db.delete(current_state)
        return None

    snapshot = (
        _build_single_record_snapshot(records[-1], item, household)
        if len(records) == 1
        else _build_multi_record_snapshot(records[-5:], item)
    )

    state = current_state or InventoryState(household_item_id=item.id)
    for field, value in snapshot.items():
        setattr(state, field, value)

    db.add(state)
    return state
