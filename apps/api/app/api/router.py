from fastapi import APIRouter

from app.api.routes import auth, household, items, purchase_records

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(household.router)
api_router.include_router(items.router)
api_router.include_router(purchase_records.router)
