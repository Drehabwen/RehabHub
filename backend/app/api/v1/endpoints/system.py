from __future__ import annotations

from fastapi import APIRouter

from app.core.responses import ok_response
from app.services.json_store import (
    ASSESSMENT_RESULTS_FILE,
    REPORTS_FILE,
    normalize_assessment_result,
    normalize_report,
    read_json_array,
    summarize_recent_activity,
)


router = APIRouter()


@router.get("/health")
async def system_health():
    return ok_response({"status": "ok", "service": "fastapi", "version": "0.2.0"})


@router.get("/stats")
async def system_stats():
    results = [
        normalize_assessment_result(item)
        for item in read_json_array(ASSESSMENT_RESULTS_FILE)
    ]
    reports = [normalize_report(item) for item in read_json_array(REPORTS_FILE)]

    score_values = [
        float(item["overallScore"]["value"])
        for item in results
        if item.get("overallScore") and item["overallScore"].get("value") is not None
    ]

    patient_ids = {
        str(item.get("patientId"))
        for item in results + reports
        if str(item.get("patientId") or "").strip()
    }

    assessments_by_movement = {}
    for item in results:
        movement_type = str(item.get("movementType") or "unknown")
        assessments_by_movement[movement_type] = assessments_by_movement.get(movement_type, 0) + 1

    return ok_response(
        {
            "total_patients": len(patient_ids),
            "total_assessments": len(results),
            "average_score": round(sum(score_values) / len(score_values), 1) if score_values else 0.0,
            "assessments_by_movement": assessments_by_movement,
            "recent_activity": summarize_recent_activity(results),
        }
    )
