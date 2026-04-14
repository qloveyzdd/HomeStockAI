from __future__ import annotations

import sys
from pathlib import Path

from passlib.context import CryptContext
from sqlalchemy.orm import Session

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from app.core.database import SessionLocal
from app.models.account import Account

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
TEST_PHONE = "13800000000"
TEST_PASSWORD = "test123456"


def seed_account(db: Session) -> None:
    account = db.query(Account).filter(Account.phone == TEST_PHONE).first()
    password_hash = pwd_context.hash(TEST_PASSWORD)

    if account is None:
        account = Account(phone=TEST_PHONE, password_hash=password_hash)
        db.add(account)
    else:
        account.password_hash = password_hash
        db.add(account)

    db.commit()


if __name__ == "__main__":
    session = SessionLocal()
    try:
        seed_account(session)
        print(f"Seeded test account: {TEST_PHONE} / {TEST_PASSWORD}")
    finally:
        session.close()
