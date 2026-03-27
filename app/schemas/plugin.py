"""Plugin Pydantic v2 şemaları."""

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import Field

from app.schemas.base import BaseSchema, CursorInfo


class PluginCreate(BaseSchema):
    slug: str = Field(..., min_length=1, max_length=100, pattern=r"^[a-z0-9-]+$")
    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    version: str | None = Field(None, max_length=50)
    category: str | None = Field(None, max_length=100)
    is_public: bool = False


class PluginUpdate(BaseSchema):
    name: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    version: str | None = Field(None, max_length=50)
    category: str | None = None
    is_public: bool | None = None
    metadata: dict[str, Any] | None = None


class PluginResponse(BaseSchema):
    uid: UUID
    slug: str
    name: str
    description: str | None
    version: str | None
    category: str | None
    is_public: bool
    metadata: dict[str, Any]
    created_at: datetime
    updated_at: datetime


class PluginListResponse(BaseSchema):
    items: list[PluginResponse]
    cursor: CursorInfo
