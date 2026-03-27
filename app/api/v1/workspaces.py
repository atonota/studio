"""Workspace CRUD endpoint'leri.

Tenant-scoped: her işlem tenant_id ile filtrelenir.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_async_session
from app.schemas.workspace import WorkspaceCreate, WorkspaceListResponse, WorkspaceResponse, WorkspaceUpdate
from app.services import workspace as workspace_service

router = APIRouter()


@router.post("", response_model=WorkspaceResponse, status_code=201)
async def create_workspace(
    tenant_uid: UUID,
    data: WorkspaceCreate,
    session: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> WorkspaceResponse:
    return await workspace_service.create_workspace(session, tenant_uid, data)


@router.get("", response_model=WorkspaceListResponse)
async def list_workspaces(
    tenant_uid: UUID,
    cursor: str | None = Query(None),
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> WorkspaceListResponse:
    return await workspace_service.list_workspaces(session, tenant_uid, cursor=cursor, limit=limit)


@router.get("/{workspace_uid}", response_model=WorkspaceResponse)
async def get_workspace(
    tenant_uid: UUID,
    workspace_uid: UUID,
    session: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> WorkspaceResponse:
    workspace = await workspace_service.get_workspace(session, workspace_uid, tenant_uid)
    if not workspace:
        raise HTTPException(status_code=404, detail="NOT_FOUND")
    return workspace


@router.patch("/{workspace_uid}", response_model=WorkspaceResponse)
async def update_workspace(
    tenant_uid: UUID,
    workspace_uid: UUID,
    data: WorkspaceUpdate,
    session: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> WorkspaceResponse:
    workspace = await workspace_service.update_workspace(session, workspace_uid, tenant_uid, data)
    if not workspace:
        raise HTTPException(status_code=404, detail="NOT_FOUND")
    return workspace


@router.delete("/{workspace_uid}", status_code=204)
async def delete_workspace(
    tenant_uid: UUID,
    workspace_uid: UUID,
    session: AsyncSession = Depends(get_async_session),  # noqa: B008
) -> None:
    deleted = await workspace_service.soft_delete_workspace(session, workspace_uid, tenant_uid)
    if not deleted:
        raise HTTPException(status_code=404, detail="NOT_FOUND")
