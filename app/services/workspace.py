"""Workspace iş mantığı servisi."""

import base64
import json
from datetime import datetime
from uuid import UUID

from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.models.workspace import Workspace
from app.schemas.base import CursorInfo
from app.schemas.workspace import WorkspaceCreate, WorkspaceListResponse, WorkspaceResponse, WorkspaceUpdate

logger = get_logger(__name__)


def _encode_cursor(created_at: datetime, uid: UUID) -> str:
    data = {"c": created_at.isoformat(), "i": str(uid)}
    return base64.urlsafe_b64encode(json.dumps(data).encode()).decode()


def _decode_cursor(cursor: str) -> tuple[datetime, UUID]:
    data = json.loads(base64.urlsafe_b64decode(cursor))
    return datetime.fromisoformat(data["c"]), UUID(data["i"])


async def create_workspace(
    session: AsyncSession,
    tenant_id: UUID,
    data: WorkspaceCreate,
) -> WorkspaceResponse:
    workspace = Workspace(
        tenant_id=tenant_id,
        name=data.name,
        url=data.url,
        platform=data.platform,
    )
    session.add(workspace)
    await session.commit()
    await session.refresh(workspace)
    logger.info("workspace_created", workspace_uid=str(workspace.uid), tenant_id=str(tenant_id))
    return WorkspaceResponse.model_validate(workspace)


async def get_workspace(
    session: AsyncSession,
    workspace_uid: UUID,
    tenant_id: UUID,
) -> WorkspaceResponse | None:
    result = await session.execute(
        select(Workspace).where(
            Workspace.uid == workspace_uid,
            Workspace.tenant_id == tenant_id,
            Workspace.deleted_at.is_(None),
        )
    )
    workspace = result.scalar_one_or_none()
    if not workspace:
        return None
    return WorkspaceResponse.model_validate(workspace)


async def update_workspace(
    session: AsyncSession,
    workspace_uid: UUID,
    tenant_id: UUID,
    data: WorkspaceUpdate,
) -> WorkspaceResponse | None:
    result = await session.execute(
        select(Workspace).where(
            Workspace.uid == workspace_uid,
            Workspace.tenant_id == tenant_id,
            Workspace.deleted_at.is_(None),
        )
    )
    workspace = result.scalar_one_or_none()
    if not workspace:
        return None

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(workspace, field, value)

    await session.commit()
    await session.refresh(workspace)
    logger.info("workspace_updated", workspace_uid=str(workspace_uid))
    return WorkspaceResponse.model_validate(workspace)


async def soft_delete_workspace(
    session: AsyncSession,
    workspace_uid: UUID,
    tenant_id: UUID,
) -> bool:
    result = await session.execute(
        select(Workspace).where(
            Workspace.uid == workspace_uid,
            Workspace.tenant_id == tenant_id,
            Workspace.deleted_at.is_(None),
        )
    )
    workspace = result.scalar_one_or_none()
    if not workspace:
        return False

    workspace.deleted_at = func.now()  # type: ignore[assignment]
    await session.commit()
    logger.info("workspace_soft_deleted", workspace_uid=str(workspace_uid))
    return True


async def list_workspaces(
    session: AsyncSession,
    tenant_id: UUID,
    cursor: str | None = None,
    limit: int = 20,
) -> WorkspaceListResponse:
    query = select(Workspace).where(
        Workspace.tenant_id == tenant_id,
        Workspace.deleted_at.is_(None),
    )

    if cursor:
        cursor_dt, cursor_uid = _decode_cursor(cursor)
        query = query.where(
            or_(
                Workspace.created_at < cursor_dt,
                and_(Workspace.created_at == cursor_dt, Workspace.uid < cursor_uid),
            )
        )

    query = query.order_by(Workspace.created_at.desc(), Workspace.uid.desc()).limit(limit + 1)

    result = await session.execute(query)
    workspaces = list(result.scalars().all())

    has_more = len(workspaces) > limit
    if has_more:
        workspaces = workspaces[:limit]

    items = [WorkspaceResponse.model_validate(w) for w in workspaces]

    next_cursor = None
    if has_more and workspaces:
        last = workspaces[-1]
        next_cursor = _encode_cursor(last.created_at, last.uid)

    return WorkspaceListResponse(
        items=items,
        cursor=CursorInfo(next_cursor=next_cursor, has_more=has_more),
    )
