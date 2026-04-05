from __future__ import annotations

from fastapi import APIRouter, Query

from app.core.responses import error_response, ok_response
from app.schemas.resources import ReportCreate
from app.services.json_store import (
    REPORTS_FILE,
    build_id,
    normalize_report,
    paginate_items,
    read_json_array,
    write_json_array,
)


router = APIRouter()


def _model_dump(model: ReportCreate) -> dict:
    return model.model_dump() if hasattr(model, "model_dump") else model.dict()


@router.get("")
async def list_reports(
    page: int = Query(default=1, ge=1),
    pageSize: int = Query(default=20, ge=1),
):
    records = [normalize_report(item) for item in read_json_array(REPORTS_FILE)]
    records.sort(key=lambda item: str(item.get("date", "")), reverse=True)
    return ok_response(paginate_items(records, page, pageSize))


@router.post("")
async def create_report(payload: ReportCreate):
    records = read_json_array(REPORTS_FILE)
    record = normalize_report(
        {
            "id": build_id("report"),
            **_model_dump(payload),
        }
    )
    records.append(record)
    write_json_array(REPORTS_FILE, records)
    return ok_response(record)


@router.get("/{report_id}")
async def get_report(report_id: str):
    records = read_json_array(REPORTS_FILE)
    found = next((item for item in records if str(item.get("id")) == report_id), None)
    if not found:
        return error_response(404, "report not found")
    return ok_response(normalize_report(found))


@router.delete("/{report_id}")
async def delete_report(report_id: str):
    records = read_json_array(REPORTS_FILE)
    next_records = [item for item in records if str(item.get("id")) != report_id]
    if len(next_records) == len(records):
        return error_response(404, "report not found")

    write_json_array(REPORTS_FILE, next_records)
    return ok_response({"status": "ok"})


@router.get("/{report_id}/export")
async def export_report(report_id: str, format: str = Query(default="pdf")):
    records = read_json_array(REPORTS_FILE)
    found = next((item for item in records if str(item.get("id")) == report_id), None)
    if not found:
        return error_response(404, "report not found")
    return ok_response({"status": "ok", "id": report_id, "format": format})
