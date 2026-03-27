"""Tenant Pydantic v2 şemaları."""

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import Field

from app.schemas.base import BaseSchema, CursorInfo


class TenantCreate(BaseSchema):
    name: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=100, pattern=r"^[a-z0-9-]+$")
    domain: str | None = Field(None, max_length=255)
    plan: str = Field("free", max_length=50)
    description: str | None = None


class TenantUpdate(BaseSchema):
    name: str | None = Field(None, min_length=1, max_length=255)
    slug: str | None = Field(None, min_length=1, max_length=100, pattern=r"^[a-z0-9-]+$")
    domain: str | None = None
    plan: str | None = Field(None, max_length=50)
    description: str | None = None
    settings: dict[str, Any] | None = None
    is_active: bool | None = None


class TenantResponse(BaseSchema):
    uid: UUID
    name: str
    slug: str
    domain: str | None
    plan: str
    settings: dict[str, Any]
    is_active: bool
    description: str | None
    created_at: datetime
    updated_at: datetime


class TenantListResponse(BaseSchema):
    items: list[TenantResponse]
    cursor: CursorInfo
