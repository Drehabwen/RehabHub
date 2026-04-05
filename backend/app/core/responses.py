from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict

from fastapi.responses import JSONResponse


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def ok_response(data: Any, message: str = "ok") -> Dict[str, Any]:
    return {
        "code": 200,
        "message": message,
        "data": data,
        "timestamp": utc_now_iso(),
    }


def error_response(
    http_status: int,
    message: str,
    code: int | None = None,
    details: Any = None,
) -> JSONResponse:
    return JSONResponse(
        status_code=http_status,
        content={
            "code": code or http_status,
            "message": message,
            "data": details,
            "timestamp": utc_now_iso(),
        },
    )
