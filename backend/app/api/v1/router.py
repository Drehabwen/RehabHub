from fastapi import APIRouter
from app.api.v1.endpoints import assessment

api_router = APIRouter()
api_router.include_router(assessment.router, prefix="/assessment", tags=["assessment"])
