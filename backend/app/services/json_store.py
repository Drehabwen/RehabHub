from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List
from uuid import uuid4


PROJECT_ROOT = Path(__file__).resolve().parents[3]
DATA_DIR = PROJECT_ROOT / "data"
ASSESSMENT_RESULTS_FILE = DATA_DIR / "assessment-results.json"
REPORTS_FILE = DATA_DIR / "reports.json"
POSE_TELEMETRY_FILE = DATA_DIR / "pose-telemetry.json"

VALID_REPORT_STATUSES = {"completed", "in-progress", "draft"}


def ensure_data_dir() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def utc_today() -> str:
    return utc_now_iso().split("T")[0]


def build_id(prefix: str) -> str:
    return f"{prefix}_{uuid4().hex[:12]}"


def read_json_array(file_path: Path) -> List[Dict[str, Any]]:
    ensure_data_dir()
    if not file_path.exists():
        return []

    try:
        content = file_path.read_text(encoding="utf-8")
        parsed = json.loads(content)
    except (OSError, json.JSONDecodeError):
        return []

    if not isinstance(parsed, list):
        return []

    return [item for item in parsed if isinstance(item, dict)]


def write_json_array(file_path: Path, items: List[Dict[str, Any]]) -> None:
    ensure_data_dir()
    file_path.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")


def paginate_items(items: List[Dict[str, Any]], page: int, page_size: int) -> Dict[str, Any]:
    total = len(items)
    start = (page - 1) * page_size
    return {
        "items": items[start : start + page_size],
        "pagination": {
            "page": page,
            "pageSize": page_size,
            "total": total,
            "totalPages": (total + page_size - 1) // page_size if page_size else 0,
        },
    }


def _coerce_number(value: Any) -> float | None:
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        try:
            return float(value)
        except ValueError:
            return None
    return None


def _normalize_score(value: Any, max_value: float = 100.0) -> Dict[str, float] | None:
    if isinstance(value, dict):
        raw_value = _coerce_number(value.get("value"))
        raw_max_value = _coerce_number(value.get("maxValue"))
        if raw_value is None:
            return None
        return {
            "value": round(raw_value, 1),
            "maxValue": round(raw_max_value if raw_max_value is not None else max_value, 1),
        }

    if isinstance(value, str) and "/" in value:
        raw_value, raw_max_value = value.split("/", 1)
        parsed_value = _coerce_number(raw_value)
        parsed_max_value = _coerce_number(raw_max_value)
        if parsed_value is None or parsed_max_value is None:
            return None
        return {
            "value": round(parsed_value, 1),
            "maxValue": round(parsed_max_value, 1),
        }

    parsed_value = _coerce_number(value)
    if parsed_value is None:
        return None

    return {
        "value": round(parsed_value, 1),
        "maxValue": round(max_value, 1),
    }


def _normalize_angles(value: Any) -> Dict[str, float]:
    if not isinstance(value, dict):
        return {}

    normalized: Dict[str, float] = {}
    for key, raw_value in value.items():
        parsed = _coerce_number(raw_value)
        if parsed is None:
            continue
        normalized[str(key)] = round(parsed, 1)
    return normalized


def _normalize_recommendations(record: Dict[str, Any]) -> List[str]:
    recommendations = record.get("recommendations")
    if isinstance(recommendations, list):
        return [str(item) for item in recommendations if str(item).strip()]

    feedback = record.get("feedback")
    if isinstance(feedback, str) and feedback.strip():
        return [feedback.strip()]

    return []


def normalize_assessment_result(record: Dict[str, Any]) -> Dict[str, Any]:
    movement_type = str(record.get("movementType") or "unknown")
    overall_score = _normalize_score(
        record.get("overallScore") or record.get("scoreSummary") or record.get("score")
    )
    mobility_score = _normalize_score(record.get("mobilityScore"))
    stability_score = _normalize_score(record.get("stabilityScore"))

    if overall_score and mobility_score is None:
        mobility_score = dict(overall_score)
    if overall_score and stability_score is None:
        stability_score = dict(overall_score)

    return {
        "id": str(record.get("id") or build_id("result")),
        "patientId": str(record.get("patientId") or "guest"),
        "movementType": movement_type,
        "movementName": str(record.get("movementName") or movement_type or "Unknown Movement"),
        "timestamp": str(record.get("timestamp") or utc_now_iso()),
        "overallScore": overall_score,
        "mobilityScore": mobility_score,
        "stabilityScore": stability_score,
        "angles": _normalize_angles(record.get("angles") or record.get("anglesSummary") or {}),
        "recommendations": _normalize_recommendations(record),
    }


def normalize_report(record: Dict[str, Any]) -> Dict[str, Any]:
    status = str(record.get("status") or "draft")
    if status not in VALID_REPORT_STATUSES:
        status = "draft"

    return {
        "id": str(record.get("id") or build_id("report")),
        "patientId": str(record.get("patientId") or ""),
        "patientName": str(record.get("patientName") or ""),
        "testId": str(record.get("testId") or ""),
        "testName": str(record.get("testName") or "评估报告"),
        "date": str(record.get("date") or utc_today()),
        "score": round(_coerce_number(record.get("score")) or 0.0, 1),
        "status": status,
        "summary": str(record.get("summary") or ""),
        "details": str(record.get("details") or ""),
    }


def summarize_recent_activity(records: List[Dict[str, Any]], days: int = 7) -> List[Dict[str, Any]]:
    counts: Dict[str, int] = {}
    for record in records:
        timestamp = str(record.get("timestamp") or "")
        date_key = timestamp.split("T")[0] if "T" in timestamp else timestamp[:10]
        if not date_key:
            continue
        counts[date_key] = counts.get(date_key, 0) + 1

    recent_days = sorted(counts.keys(), reverse=True)[:days]
    return [{"date": date_key, "count": counts[date_key]} for date_key in sorted(recent_days)]
