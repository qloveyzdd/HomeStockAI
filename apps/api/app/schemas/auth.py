from __future__ import annotations

from pydantic import BaseModel


class LoginRequest(BaseModel):
    phone: str
    password: str


class SessionAccountSchema(BaseModel):
    id: str
    phone: str


class SessionResponse(BaseModel):
    account: SessionAccountSchema | None
    household_id: str | None
    setup_completed: bool
