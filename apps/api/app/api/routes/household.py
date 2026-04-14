from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_household, require_account
from app.core.database import get_db
from app.models.account import Account
from app.models.household import Household
from app.schemas.household import HouseholdCreate, HouseholdResponse, HouseholdUpdate

router = APIRouter(prefix="/household", tags=["household"])


@router.get("/me", response_model=HouseholdResponse | None)
def get_household_me(household: Household | None = Depends(get_current_household)) -> Household | None:
    return household


@router.post("", response_model=HouseholdResponse)
def create_household(
    payload: HouseholdCreate,
    account: Account = Depends(require_account),
    household: Household | None = Depends(get_current_household),
    db: Session = Depends(get_db),
) -> Household:
    if household is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="家庭档案已存在")

    new_household = Household(owner_account_id=account.id, **payload.model_dump())
    db.add(new_household)
    db.commit()
    db.refresh(new_household)
    return new_household


@router.patch("/{household_id}", response_model=HouseholdResponse)
def update_household(
    household_id: str,
    payload: HouseholdUpdate,
    account: Account = Depends(require_account),
    db: Session = Depends(get_db),
) -> Household:
    household = (
        db.query(Household)
        .filter(Household.id == household_id, Household.owner_account_id == account.id)
        .first()
    )
    if household is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="家庭档案不存在")

    for field, value in payload.model_dump().items():
        setattr(household, field, value)

    db.add(household)
    db.commit()
    db.refresh(household)
    return household
