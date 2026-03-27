"""User auth Pydantic v2 şemaları (FastAPI-Users)."""

from uuid import UUID

from fastapi_users import schemas


class UserRead(schemas.BaseUser[UUID]):
    full_name: str | None = None
    tenant_id: str | None = None
    role: str = "member"


class UserCreate(schemas.BaseUserCreate):
    full_name: str | None = None
    tenant_id: str | None = None
    role: str = "member"


class UserUpdate(schemas.BaseUserUpdate):
    full_name: str | None = None
    tenant_id: str | None = None
    role: str | None = None
