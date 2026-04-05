from fastapi import APIRouter
from app.api.v1.endpoints import assessment, assessment_results, reports, system

api_router = APIRouter()
api_router.include_router(assessment.router, prefix="/assessment", tags=["assessment"])
api_router.include_router(assessment_results.router, prefix="/assessment-results", tags=["assessment-results"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(system.router, prefix="/system", tags=["system"])
