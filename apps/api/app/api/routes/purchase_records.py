from __future__ import annotations

from decimal import Decimal, ROUND_HALF_UP

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_household, require_account
from app.api.routes.items import get_owned_item
from app.core.database import get_db
from app.domain.order_text_parser import parse_order_text
from app.models.account import Account
from app.models.household import Household
from app.models.purchase_record import PurchaseRecord
from app.schemas.purchase_record import (
    ParseOrderTextCandidate,
    ParseOrderTextRequest,
    PurchaseRecordCreate,
    PurchaseRecordSummary,
)
from app.services.inventory_estimator import recalculate_inventory_state

router = APIRouter(prefix="/purchase-records", tags=["purchase-records"])


def _to_decimal(value: float) -> Decimal:
    return Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


@router.post("", response_model=PurchaseRecordSummary)
def create_purchase_record(
    payload: PurchaseRecordCreate,
    account: Account = Depends(require_account),
    household: Household | None = Depends(get_current_household),
    db: Session = Depends(get_db),
) -> PurchaseRecord:
    if household is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="请先创建家庭档案")

    item = get_owned_item(payload.household_item_id, household.id, db)
    quantity = _to_decimal(payload.quantity)
    total_price = _to_decimal(payload.total_price)
    unit_price = (total_price / quantity).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    record = PurchaseRecord(
        household_item_id=item.id,
        platform=payload.platform.strip(),
        sku_title=payload.sku_title.strip() if payload.sku_title else None,
        quantity=quantity,
        total_price=total_price,
        unit_price=unit_price,
        purchased_at=payload.purchased_at,
        source=payload.source,
        raw_text=payload.raw_text,
    )
    db.add(record)
    db.flush()
    recalculate_inventory_state(db, item, household)
    db.commit()
    db.refresh(record)
    return record


@router.get("", response_model=list[PurchaseRecordSummary])
def list_purchase_records(
    item_id: str = Query(..., alias="item_id"),
    account: Account = Depends(require_account),
    household: Household | None = Depends(get_current_household),
    db: Session = Depends(get_db),
) -> list[PurchaseRecord]:
    if household is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="请先创建家庭档案")

    item = get_owned_item(item_id, household.id, db)
    return (
        db.query(PurchaseRecord)
        .filter(PurchaseRecord.household_item_id == item.id)
        .order_by(PurchaseRecord.purchased_at.desc(), PurchaseRecord.created_at.desc())
        .all()
    )


@router.post("/parse-text", response_model=ParseOrderTextCandidate)
def parse_purchase_record_text(
    payload: ParseOrderTextRequest,
    account: Account = Depends(require_account),
    household: Household | None = Depends(get_current_household),
) -> ParseOrderTextCandidate:
    if household is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="请先创建家庭档案")

    return ParseOrderTextCandidate(**parse_order_text(payload.text))
