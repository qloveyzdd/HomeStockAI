from __future__ import annotations

from celery import Celery

REDIS_URL = "redis://localhost:6379/0"

celery_app = Celery(
    "refillwise_worker",
    broker=REDIS_URL,
    backend=REDIS_URL,
)


@celery_app.task(name="worker.ping")
def ping() -> str:
    return "pong"
