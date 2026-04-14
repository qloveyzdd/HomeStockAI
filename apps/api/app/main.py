from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.session import setup_session_middleware

app = FastAPI(title="RefillWise API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.web_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
setup_session_middleware(app)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
