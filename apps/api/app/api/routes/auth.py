from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request, status
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.api.deps import get_current_household, require_account
from app.core.database import get_db
from app.models.account import Account
from app.models.household import Household
from app.schemas.auth import LoginRequest, SessionAccountSchema, SessionResponse

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter(prefix="/auth", tags=["auth"])


def build_session_response(account: Account | None, household: Household | None) -> SessionResponse:
    return SessionResponse(
        account=SessionAccountSchema(id=account.id, phone=account.phone) if account else None,
        household_id=household.id if household else None,
        setup_completed=household is not None,
    )


@router.post("/login", response_model=SessionResponse)
def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)) -> SessionResponse:
    account = db.query(Account).filter(Account.phone == payload.phone).first()
    if account is None or not pwd_context.verify(payload.password, account.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="手机号或密码错误")

    request.session["account_id"] = account.id
    household = db.query(Household).filter(Household.owner_account_id == account.id).first()
    return build_session_response(account, household)


@router.post("/logout", response_model=SessionResponse)
def logout(request: Request) -> SessionResponse:
    request.session.clear()
    return SessionResponse(account=None, household_id=None, setup_completed=False)


@router.get("/me", response_model=SessionResponse)
def me(
    account: Account = Depends(require_account),
    household: Household | None = Depends(get_current_household),
) -> SessionResponse:
    return build_session_response(account, household)
