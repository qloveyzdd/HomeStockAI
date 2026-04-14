from __future__ import annotations

from collections.abc import Sequence
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import get_current_household, require_account
from app.core.database import get_db
from app.domain.item_catalog import get_item_catalog, list_item_catalog
from app.models.account import Account
from app.models.household import Household
from app.models.household_item import HouseholdItem
from app.models.inventory_state import InventoryState
from app.models.purchase_record import PurchaseRecord
from app.schemas.inventory import InventoryStateResponse
from app.schemas.item import (
    HouseholdItemCreate,
    HouseholdItemResponse,
    HouseholdItemUpdate,
    ItemCatalogEntry,
)
from app.services.inventory_estimator import recalculate_inventory_state

router = APIRouter(prefix="/items", tags=["items"])


def get_owned_item(item_id: str, household_id: str, db: Session) -> HouseholdItem:
    item = (
        db.query(HouseholdItem)
        .filter(HouseholdItem.id == item_id, HouseholdItem.household_id == household_id)
        .first()
    )
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="物品不存在")
    return item


def normalize_item_payload(payload: HouseholdItemCreate | HouseholdItemUpdate) -> dict:
    data = payload.model_dump()
    catalog = get_item_catalog(data["category"])
    is_custom = data.get("is_custom", False)

    if not is_custom and catalog is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="不支持的预设品类")

    if is_custom and not data.get("name"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="自定义物品必须填写名称")

    if not data.get("name"):
        data["name"] = data["category"]

    if catalog is not None:
        data["unit"] = data.get("unit") or str(catalog["unit"])
        data["safety_stock_days"] = data.get("safety_stock_days") or int(catalog["safety_stock_days"])
    else:
        data["unit"] = data.get("unit") or "件"
        data["safety_stock_days"] = data.get("safety_stock_days") or 7

    return data


def get_inventory_status(record_count: int, inventory_state: InventoryState | None) -> str:
    if record_count == 0:
        return "no_records"
    if inventory_state is None or float(inventory_state.confidence_score) <= 0.35:
        return "estimating"
    if inventory_state.below_safety_stock:
        return "low_stock"
    return "estimated"


def build_item_response(
    item: HouseholdItem,
    inventory_state: InventoryState | None = None,
    record_count: int = 0,
    last_purchased_at: datetime | None = None,
) -> HouseholdItemResponse:
    return HouseholdItemResponse(
        id=item.id,
        household_id=item.household_id,
        name=item.name,
        category=item.category,
        brand=item.brand,
        spec_text=item.spec_text,
        unit=item.unit,
        safety_stock_days=item.safety_stock_days,
        preferred_platform=item.preferred_platform,
        replaceable=item.replaceable,
        enabled=item.enabled,
        is_custom=item.is_custom,
        estimated_remaining_days=inventory_state.estimated_remaining_days if inventory_state else None,
        inventory_status=get_inventory_status(record_count, inventory_state),
        last_purchased_at=last_purchased_at,
    )


def build_item_list_response(items: Sequence[HouseholdItem], db: Session) -> list[HouseholdItemResponse]:
    if not items:
        return []

    item_ids = [item.id for item in items]
    state_rows = (
        db.query(InventoryState)
        .filter(InventoryState.household_item_id.in_(item_ids))
        .all()
    )
    inventory_states = {state.household_item_id: state for state in state_rows}

    record_stats_rows = (
        db.query(
            PurchaseRecord.household_item_id,
            func.count(PurchaseRecord.id),
            func.max(PurchaseRecord.purchased_at),
        )
        .filter(PurchaseRecord.household_item_id.in_(item_ids))
        .group_by(PurchaseRecord.household_item_id)
        .all()
    )
    record_stats = {
        item_id: {"count": count, "last_purchased_at": last_purchased_at}
        for item_id, count, last_purchased_at in record_stats_rows
    }

    return [
        build_item_response(
            item,
            inventory_state=inventory_states.get(item.id),
            record_count=int(record_stats.get(item.id, {}).get("count", 0)),
            last_purchased_at=record_stats.get(item.id, {}).get("last_purchased_at"),
        )
        for item in items
    ]


@router.get("/catalog", response_model=list[ItemCatalogEntry])
def get_catalog() -> list[dict[str, int | str]]:
    return list_item_catalog()


@router.get("", response_model=list[HouseholdItemResponse])
def list_items(
    account: Account = Depends(require_account),
    household: Household | None = Depends(get_current_household),
    db: Session = Depends(get_db),
) -> list[HouseholdItemResponse]:
    if household is None:
        return []

    items = (
        db.query(HouseholdItem)
        .filter(HouseholdItem.household_id == household.id)
        .order_by(HouseholdItem.created_at.desc())
        .all()
    )
    return build_item_list_response(items, db)


@router.post("", response_model=HouseholdItemResponse)
def create_item(
    payload: HouseholdItemCreate,
    account: Account = Depends(require_account),
    household: Household | None = Depends(get_current_household),
    db: Session = Depends(get_db),
) -> HouseholdItemResponse:
    if household is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="请先创建家庭档案")

    data = normalize_item_payload(payload)
    item = HouseholdItem(household_id=household.id, **data)
    db.add(item)
    db.commit()
    db.refresh(item)
    return build_item_response(item)


@router.get("/{item_id}", response_model=HouseholdItemResponse)
def get_item(
    item_id: str,
    account: Account = Depends(require_account),
    household: Household | None = Depends(get_current_household),
    db: Session = Depends(get_db),
) -> HouseholdItemResponse:
    if household is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="请先创建家庭档案")
    item = get_owned_item(item_id, household.id, db)

    last_purchased_at = (
        db.query(func.max(PurchaseRecord.purchased_at))
        .filter(PurchaseRecord.household_item_id == item.id)
        .scalar()
    )
    record_count = (
        db.query(func.count(PurchaseRecord.id))
        .filter(PurchaseRecord.household_item_id == item.id)
        .scalar()
    )
    return build_item_response(item, item.inventory_state, int(record_count or 0), last_purchased_at)


@router.patch("/{item_id}", response_model=HouseholdItemResponse)
def update_item(
    item_id: str,
    payload: HouseholdItemUpdate,
    account: Account = Depends(require_account),
    household: Household | None = Depends(get_current_household),
    db: Session = Depends(get_db),
) -> HouseholdItemResponse:
    if household is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="请先创建家庭档案")

    item = get_owned_item(item_id, household.id, db)
    data = normalize_item_payload(payload)
    for field, value in data.items():
        setattr(item, field, value)

    db.add(item)
    db.commit()
    db.refresh(item)
    return build_item_response(item, item.inventory_state)


@router.post("/{item_id}/disable", response_model=HouseholdItemResponse)
def disable_item(
    item_id: str,
    account: Account = Depends(require_account),
    household: Household | None = Depends(get_current_household),
    db: Session = Depends(get_db),
) -> HouseholdItemResponse:
    if household is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="请先创建家庭档案")
    item = get_owned_item(item_id, household.id, db)
    item.enabled = False
    db.add(item)
    db.commit()
    db.refresh(item)
    return build_item_response(item, item.inventory_state)


@router.post("/{item_id}/enable", response_model=HouseholdItemResponse)
def enable_item(
    item_id: str,
    account: Account = Depends(require_account),
    household: Household | None = Depends(get_current_household),
    db: Session = Depends(get_db),
) -> HouseholdItemResponse:
    if household is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="请先创建家庭档案")
    item = get_owned_item(item_id, household.id, db)
    item.enabled = True
    db.add(item)
    db.commit()
    db.refresh(item)
    return build_item_response(item, item.inventory_state)


@router.get("/{item_id}/inventory-state", response_model=InventoryStateResponse)
def get_item_inventory_state(
    item_id: str,
    account: Account = Depends(require_account),
    household: Household | None = Depends(get_current_household),
    db: Session = Depends(get_db),
) -> InventoryState:
    if household is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="请先创建家庭档案")

    item = get_owned_item(item_id, household.id, db)
    state = item.inventory_state
    if state is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="还没有库存估算")
    return state


@router.post("/{item_id}/recalculate", response_model=InventoryStateResponse)
def recalculate_item_inventory(
    item_id: str,
    account: Account = Depends(require_account),
    household: Household | None = Depends(get_current_household),
    db: Session = Depends(get_db),
) -> InventoryState:
    if household is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="请先创建家庭档案")

    item = get_owned_item(item_id, household.id, db)
    state = recalculate_inventory_state(db, item, household)
    if state is None:
        db.commit()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="先记下第一次购买")
    db.commit()
    db.refresh(state)
    return state
