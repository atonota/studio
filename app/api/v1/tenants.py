"""Tenant CRUD endpoint'leri.

ENDPOINT   : GET/POST /api/v1/tenants
             GET/PATCH/DELETE /api/v1/tenants/{tenant_uid}
AUTH       : Bearer JWT (superuser)
RATE       : 30 req/min per tenant
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_async_session
from app.schemas.tenant import TenantCreate, TenantListResponse, TenantResponse, TenantUpdate
from app.services import tenant as tenant_service

router = APIRouter()


@router.post("", response_model=TenantResponse, status_code=201)
async def create_tenant(
    data: TenantCreate,
    session: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> TenantResponse:
    return await tenant_service.create_tenant(session, data)


@router.get("", response_model=TenantListResponse)
async def list_tenants(
    cursor: str | None = Query(None),
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> TenantListResponse:
    return await tenant_service.list_tenants(session, cursor=cursor, limit=limit)


@router.get("/{tenant_uid}", response_model=TenantResponse)
async def get_tenant(
    tenant_uid: UUID,
    session: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> TenantResponse:
    tenant = await tenant_service.get_tenant(session, tenant_uid)
    if not tenant:
        raise HTTPException(status_code=404, detail="NOT_FOUND")
    return tenant


@router.patch("/{tenant_uid}", response_model=TenantResponse)
async def update_tenant(
    tenant_uid: UUID,
    data: TenantUpdate,
    session: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> TenantResponse:
    tenant = await tenant_service.update_tenant(session, tenant_uid, data)
    if not tenant:
        raise HTTPException(status_code=404, detail="NOT_FOUND")
    return tenant


@router.delete("/{tenant_uid}", status_code=204)
async def delete_tenant(
    tenant_uid: UUID,
    session: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> None:
    deleted = await tenant_service.soft_delete_tenant(session, tenant_uid)
    if not deleted:
        raise HTTPException(status_code=404, detail="NOT_FOUND")
