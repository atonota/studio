"""Workspace Pydantic v2 şemaları."""

from datetime import datetime
from uuid import UUID

from pydantic import Field

from app.schemas.base import BaseSchema, CursorInfo


class WorkspaceCreate(BaseSchema):
    name: str = Field(..., min_length=1, max_length=255)
    url: str | None = Field(None, max_length=2048)
    platform: str | None = Field(None, max_length=50)


class WorkspaceUpdate(BaseSchema):
    name: str | None = Field(None, min_length=1, max_length=255)
    url: str | None = None
    platform: str | None = None
    is_active: bool | None = None


class WorkspaceResponse(BaseSchema):
    uid: UUID
    name: str
    url: str | None
    platform: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime


class WorkspaceListResponse(BaseSchema):
    items: list[WorkspaceResponse]
    cursor: CursorInfo
