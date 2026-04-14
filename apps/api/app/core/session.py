from __future__ import annotations

from starlette.middleware.sessions import SessionMiddleware

from app.core.config import settings

SESSION_COOKIE_NAME = "refillwise_session"


def setup_session_middleware(app) -> None:
    app.add_middleware(
        SessionMiddleware,
        secret_key=settings.session_secret,
        session_cookie=SESSION_COOKIE_NAME,
        same_site="lax",
        https_only=False,
        max_age=60 * 60 * 24 * 7,
    )
