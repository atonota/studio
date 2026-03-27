"""Tenant iş mantığı servisi.

Tüm tenant CRUD operasyonları burada.
Cursor-based pagination, soft delete, audit log.
"""

import base64
import json
from datetime import datetime
from uuid import UUID

from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.models.tenant import Tenant
from app.schemas.base import CursorInfo
from app.schemas.tenant import TenantCreate, TenantListResponse, TenantResponse, TenantUpdate

logger = get_logger(__name__)


def _encode_cursor(created_at: datetime, uid: UUID) -> str:
    data = {"c": created_at.isoformat(), "i": str(uid)}
    return base64.urlsafe_b64encode(json.dumps(data).encode()).decode()


def _decode_cursor(cursor: str) -> tuple[datetime, UUID]:
    data = json.loads(base64.urlsafe_b64decode(cursor))
    return datetime.fromisoformat(data["c"]), UUID(data["i"])


async def create_tenant(
    session: AsyncSession,
    data: TenantCreate,
) -> TenantResponse:
    tenant = Tenant(
        name=data.name,
        slug=data.slug,
        domain=data.domain,
        plan=data.plan,
        description=data.description,
    )
    session.add(tenant)
    await session.commit()
    await session.refresh(tenant)
    logger.info("tenant_created", tenant_uid=str(tenant.uid), slug=data.slug)
    return TenantResponse.model_validate(tenant)


async def get_tenant(
    session: AsyncSession,
    tenant_uid: UUID,
) -> TenantResponse | None:
    result = await session.execute(
        select(Tenant).where(
            Tenant.uid == tenant_uid,
            Tenant.deleted_at.is_(None),
        )
    )
    tenant = result.scalar_one_or_none()
    if not tenant:
        return None
    return TenantResponse.model_validate(tenant)


async def update_tenant(
    session: AsyncSession,
    tenant_uid: UUID,
    data: TenantUpdate,
) -> TenantResponse | None:
    result = await session.execute(
        select(Tenant).where(
            Tenant.uid == tenant_uid,
            Tenant.deleted_at.is_(None),
        )
    )
    tenant = result.scalar_one_or_none()
    if not tenant:
        return None

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(tenant, field, value)

    await session.commit()
    await session.refresh(tenant)
    logger.info("tenant_updated", tenant_uid=str(tenant_uid), fields=list(update_data.keys()))
    return TenantResponse.model_validate(tenant)


async def soft_delete_tenant(
    session: AsyncSession,
    tenant_uid: UUID,
) -> bool:
    result = await session.execute(
        select(Tenant).where(
            Tenant.uid == tenant_uid,
            Tenant.deleted_at.is_(None),
        )
    )
    tenant = result.scalar_one_or_none()
    if not tenant:
        return False

    tenant.deleted_at = func.now()  # type: ignore[assignment]
    await session.commit()
    logger.info("tenant_soft_deleted", tenant_uid=str(tenant_uid))
    return True


async def list_tenants(
    session: AsyncSession,
    cursor: str | None = None,
    limit: int = 20,
) -> TenantListResponse:
    query = select(Tenant).where(Tenant.deleted_at.is_(None))

    if cursor:
        cursor_dt, cursor_uid = _decode_cursor(cursor)
        query = query.where(
            or_(
                Tenant.created_at < cursor_dt,
                and_(Tenant.created_at == cursor_dt, Tenant.uid < cursor_uid),
            )
        )

    query = query.order_by(Tenant.created_at.desc(), Tenant.uid.desc()).limit(limit + 1)

    result = await session.execute(query)
    tenants = list(result.scalars().all())

    has_more = len(tenants) > limit
    if has_more:
        tenants = tenants[:limit]

    items = [TenantResponse.model_validate(t) for t in tenants]

    next_cursor = None
    if has_more and tenants:
        last = tenants[-1]
        next_cursor = _encode_cursor(last.created_at, last.uid)

    return TenantListResponse(
        items=items,
        cursor=CursorInfo(next_cursor=next_cursor, has_more=has_more),
    )
