from __future__ import annotations

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.account import Account
from app.models.household import Household


def require_account(request: Request, db: Session = Depends(get_db)) -> Account:
    account_id = request.session.get("account_id")
    if not account_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="请先登录")

    account = db.get(Account, account_id)
    if account is None:
        request.session.clear()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="登录状态已失效")

    return account


def get_current_household(
    account: Account = Depends(require_account), db: Session = Depends(get_db)
) -> Household | None:
    return db.query(Household).filter(Household.owner_account_id == account.id).first()
