"""Ortak Pydantic v2 şemaları.

Cursor-based pagination, standart response wrapper'lar.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class BaseSchema(BaseModel):
    """Tüm şemaların base class'ı."""

    model_config = ConfigDict(from_attributes=True)


class TimestampSchema(BaseSchema):
    created_at: datetime
    updated_at: datetime


class CursorParams(BaseModel):
    """Cursor-based pagination parametreleri."""

    cursor: str | None = None
    limit: int = 20


class CursorInfo(BaseModel):
    """Pagination response metadata."""

    next_cursor: str | None = None
    has_more: bool = False


class PaginatedResponse(BaseModel):
    """Standart paginated response wrapper."""

    items: list[BaseSchema] = []
    cursor: CursorInfo = CursorInfo()
    total_count: int | None = None
