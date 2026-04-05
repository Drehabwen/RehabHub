from __future__ import annotations

from fastapi import APIRouter, Query

from app.core.responses import error_response, ok_response
from app.schemas.resources import AssessmentResultCreate
from app.services.json_store import (
    ASSESSMENT_RESULTS_FILE,
    build_id,
    normalize_assessment_result,
    paginate_items,
    read_json_array,
    write_json_array,
)


router = APIRouter()


def _model_dump(model: AssessmentResultCreate) -> dict:
    return model.model_dump() if hasattr(model, "model_dump") else model.dict()


@router.get("")
async def list_assessment_results(
    page: int = Query(default=1, ge=1),
    pageSize: int = Query(default=20, ge=1),
):
    records = [
        normalize_assessment_result(item)
        for item in read_json_array(ASSESSMENT_RESULTS_FILE)
    ]
    records.sort(key=lambda item: str(item.get("timestamp", "")), reverse=True)
    return ok_response(paginate_items(records, page, pageSize))


@router.post("")
async def create_assessment_result(payload: AssessmentResultCreate):
    records = read_json_array(ASSESSMENT_RESULTS_FILE)
    record = normalize_assessment_result(
        {
            "id": build_id("result"),
            **_model_dump(payload),
        }
    )
    records.append(record)
    write_json_array(ASSESSMENT_RESULTS_FILE, records)
    return ok_response(record)


@router.get("/{result_id}")
async def get_assessment_result(result_id: str):
    records = read_json_array(ASSESSMENT_RESULTS_FILE)
    found = next((item for item in records if str(item.get("id")) == result_id), None)
    if not found:
        return error_response(404, "assessment result not found")
    return ok_response(normalize_assessment_result(found))


@router.delete("/{result_id}")
async def delete_assessment_result(result_id: str):
    records = read_json_array(ASSESSMENT_RESULTS_FILE)
    next_records = [item for item in records if str(item.get("id")) != result_id]
    if len(next_records) == len(records):
        return error_response(404, "assessment result not found")

    write_json_array(ASSESSMENT_RESULTS_FILE, next_records)
    return ok_response({"status": "ok"})
