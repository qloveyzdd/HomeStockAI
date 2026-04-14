from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_household, require_account
from app.core.database import get_db
from app.domain.item_catalog import get_item_catalog, list_item_catalog
from app.models.account import Account
from app.models.household import Household
from app.models.household_item import HouseholdItem
from app.schemas.item import (
    HouseholdItemCreate,
    HouseholdItemResponse,
    HouseholdItemUpdate,
    ItemCatalogEntry,
)

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


@router.get("/catalog", response_model=list[ItemCatalogEntry])
def get_catalog() -> list[dict[str, int | str]]:
    return list_item_catalog()


@router.get("", response_model=list[HouseholdItemResponse])
def list_items(
    account: Account = Depends(require_account),
    household: Household | None = Depends(get_current_household),
    db: Session = Depends(get_db),
) -> list[HouseholdItem]:
    if household is None:
        return []

    return (
        db.query(HouseholdItem)
        .filter(HouseholdItem.household_id == household.id)
        .order_by(HouseholdItem.created_at.desc())
        .all()
    )


@router.post("", response_model=HouseholdItemResponse)
def create_item(
    payload: HouseholdItemCreate,
    account: Account = Depends(require_account),
    household: Household | None = Depends(get_current_household),
    db: Session = Depends(get_db),
) -> HouseholdItem:
    if household is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="请先创建家庭档案")

    data = normalize_item_payload(payload)
    item = HouseholdItem(household_id=household.id, **data)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/{item_id}", response_model=HouseholdItemResponse)
def get_item(
    item_id: str,
    account: Account = Depends(require_account),
    household: Household | None = Depends(get_current_household),
    db: Session = Depends(get_db),
) -> HouseholdItem:
    if household is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="请先创建家庭档案")
    return get_owned_item(item_id, household.id, db)


@router.patch("/{item_id}", response_model=HouseholdItemResponse)
def update_item(
    item_id: str,
    payload: HouseholdItemUpdate,
    account: Account = Depends(require_account),
    household: Household | None = Depends(get_current_household),
    db: Session = Depends(get_db),
) -> HouseholdItem:
    if household is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="请先创建家庭档案")

    item = get_owned_item(item_id, household.id, db)
    data = normalize_item_payload(payload)
    for field, value in data.items():
        setattr(item, field, value)

    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.post("/{item_id}/disable", response_model=HouseholdItemResponse)
def disable_item(
    item_id: str,
    account: Account = Depends(require_account),
    household: Household | None = Depends(get_current_household),
    db: Session = Depends(get_db),
) -> HouseholdItem:
    if household is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="请先创建家庭档案")
    item = get_owned_item(item_id, household.id, db)
    item.enabled = False
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.post("/{item_id}/enable", response_model=HouseholdItemResponse)
def enable_item(
    item_id: str,
    account: Account = Depends(require_account),
    household: Household | None = Depends(get_current_household),
    db: Session = Depends(get_db),
) -> HouseholdItem:
    if household is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="请先创建家庭档案")
    item = get_owned_item(item_id, household.id, db)
    item.enabled = True
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
